import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
    try {
        const user = await getCurrentUser(req);
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { postId } = params;

        const post = await db.communityPost.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        const existingVote = await db.postVote.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: postId
                }
            }
        });

        if (existingVote) {
            if (existingVote.value === 1) {
                // Remove upvote
                await db.postVote.delete({
                    where: { id: existingVote.id }
                });
                await db.communityPost.update({
                    where: { id: postId },
                    data: { upvotes: { decrement: 1 } }
                });
                return NextResponse.json({ message: "Upvote removed" });
            } else {
                // Change downvote to upvote
                await db.postVote.update({
                    where: { id: existingVote.id },
                    data: { value: 1 }
                });
                await db.communityPost.update({
                    where: { id: postId },
                    data: {
                        downvotes: { decrement: 1 },
                        upvotes: { increment: 1 }
                    }
                });
                return NextResponse.json({ message: "Changed to upvote" });
            }
        }

        // New Upvote
        await db.postVote.create({
            data: {
                userId: user.id,
                postId: postId,
                value: 1
            }
        });

        await db.communityPost.update({
            where: { id: postId },
            data: { upvotes: { increment: 1 } }
        });

        // Award Karma to Author
        if (post.userId !== user.id) {
            await db.user.update({
                where: { id: post.userId },
                data: { karmaPoints: { increment: 10 } }
            });
            await db.karmaLedger.create({
                data: {
                    userId: post.userId,
                    amount: 10,
                    reason: `Post upvoted`
                }
            });
        }

        return NextResponse.json({ message: "Upvoted" });
    } catch (error) {
        console.log("[COMMUNITY_UPVOTE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
