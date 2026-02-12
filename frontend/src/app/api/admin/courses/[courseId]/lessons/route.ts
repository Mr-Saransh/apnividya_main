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
    } catch (error) {
        console.log("[COURSE_LESSONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const body = await req.json();
        const { title, description, order, liveLink, scheduledAt, youtubeVideoId, status } = body;

        const lesson = await db.lesson.create({
            data: {
                title,
                description,
                order,
                courseId,
                liveLink,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                youtubeVideoId,
                status: status || "SCHEDULED",
            }
        });

        // Simple Notification: Trigger if scheduled
        if (lesson.status === "SCHEDULED" && lesson.scheduledAt) {
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
                        message: `A new live session has been scheduled for ${new Date(lesson.scheduledAt!).toLocaleString()}`,
                        link: `/dashboard/courses/${courseId}?lessonId=${lesson.id}`,
                    }))
                });
            }
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[COURSE_LESSONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
