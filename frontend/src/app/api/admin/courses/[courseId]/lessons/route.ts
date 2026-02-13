import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const lessons = await db.lesson.findMany({
            where: { courseId },
            orderBy: { order: "asc" }
        });

        return NextResponse.json(lessons);
    } catch (error: any) {
        console.error("[COURSE_LESSONS_GET] Error:", error);
        return new NextResponse(`Internal Error: ${error.message}\nStack: ${error.stack}`, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const user = await getCurrentUser(req);
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;
        const body = await req.json().catch(() => ({}));
        console.log("[COURSE_LESSONS_POST] Request body:", body);

        if (!body || Object.keys(body).length === 0) {
            return new NextResponse("Invalid Request Body", { status: 400 });
        }

        // Verify course exists
        const course = await db.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        const { title, description, order, liveMeetingUrl, liveMeetingAt, youtubeVideoId, status } = body;

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        // Defensive date parsing
        let parsedDate = null;
        if (liveMeetingAt && liveMeetingAt !== "") {
            const date = new Date(liveMeetingAt);
            if (!isNaN(date.getTime())) {
                parsedDate = date;
            }
        }

        const lesson = await db.lesson.create({
            data: {
                title,
                description: description || "",
                order: Number(order) || 0,
                courseId,
                liveMeetingUrl: liveMeetingUrl || null,
                liveMeetingAt: parsedDate,
                youtubeVideoId: youtubeVideoId || null,
                status: status || "SCHEDULED",
                updatedAt: new Date(),
            }
        });

        // Simple Notification: Trigger if scheduled
        if (lesson.status === ("SCHEDULED" as any) && lesson.liveMeetingAt) {
            const enrollments = await db.enrollment.findMany({
                where: { courseId },
                select: { userId: true }
            });

            if (enrollments.length > 0) {
                await db.notification.createMany({
                    data: enrollments.map(e => ({
                        userId: e.userId,
                        type: "LIVE_SESSION",
                        title: `New Session: ${lesson.title}`,
                        message: `A new live session has been scheduled for ${new Date(lesson.liveMeetingAt!).toLocaleString()}`,
                        link: `/dashboard/courses/${courseId}?lessonId=${lesson.id}`,
                    }))
                });
            }
        }

        return NextResponse.json(lesson);
    } catch (error: any) {
        console.error("[COURSE_LESSONS_POST] Error:", error);
        return new NextResponse(`Internal Error: ${error.message}\nStack: ${error.stack}`, { status: 500 });
    }
}
