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
        console.log("[COMMUNITY_POST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
