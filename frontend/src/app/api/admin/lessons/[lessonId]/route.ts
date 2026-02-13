import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const body = await req.json();

        // Prepare update data, handling dates correctly
        const updateData: any = { ...body };
        if (body.liveMeetingAt) {
            updateData.liveMeetingAt = new Date(body.liveMeetingAt);
        } else if (body.liveMeetingAt === null) {
            updateData.liveMeetingAt = null;
        }

        const lesson = await db.lesson.update({
            where: { id: lessonId },
            data: updateData
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSON_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;

        await db.lesson.delete({
            where: { id: lessonId }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.log("[LESSON_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
