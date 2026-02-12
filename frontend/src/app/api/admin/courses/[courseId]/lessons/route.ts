import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const lessons = await db.lesson.findMany({
            where: {
                courseId: courseId
            },
            orderBy: {
                order: "asc"
            },
            select: {
                id: true,
                title: true
            }
        });

        return NextResponse.json(lessons);
    } catch (error) {
        console.log("[COURSE_LESSONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
