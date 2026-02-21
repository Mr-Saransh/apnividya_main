import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(req: Request, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const { commentId } = await params;
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const comment = await db.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (user.role !== 'ADMIN' && comment.userId !== user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await db.comment.delete({
            where: { id: commentId }
        });

        return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("[COMMUNITY_COMMENT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
