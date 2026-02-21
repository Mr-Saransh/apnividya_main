import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const post = await db.communityPost.findUnique({
            where: {
                id: postId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                        role: true,
                    }
                },
                comments: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                avatar: true,
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });

        if (!post) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("[COMMUNITY_POST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const { postId } = await params;
        const user = await getCurrentUser(req);
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const post = await db.communityPost.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (user.role !== 'ADMIN' && post.userId !== user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // Delete associated records first (PostVote, Comment) then the post
        await db.$transaction([
            db.postVote.deleteMany({ where: { postId } }),
            db.comment.deleteMany({ where: { postId } }),
            db.communityPost.delete({ where: { id: postId } })
        ]);

        return NextResponse.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error("[COMMUNITY_POST_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
