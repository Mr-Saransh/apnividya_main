import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
    try {
        const user = await getCurrentUser(req);
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content } = await req.json();

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        const post = await db.communityPost.findUnique({
            where: {
                id: params.postId,
            },
        });

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        const comment = await db.comment.create({
            data: {
                content: content,
                postId: params.postId,
                userId: user.id,
            },
        });

        // Karma: Award +5 to commenter
        await db.user.update({
            where: { id: user.id },
            data: { karmaPoints: { increment: 5 } }
        });

        await db.karmaLedger.create({
            data: {
                userId: user.id,
                amount: 5,
                reason: `Commented on post: ${post.title?.substring(0, 20)}...`
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.log("[COMMUNITY_COMMENT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
