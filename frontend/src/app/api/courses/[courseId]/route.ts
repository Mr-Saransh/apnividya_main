import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                lessons: {
                    where: {
                        status: "PUBLISHED"
                    },
                    orderBy: {
                        order: "asc"
                    },
                    include: {
                        mockTest: true,
                    }
                },
                instructor: {
                    select: { fullName: true, avatar: true }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Optional: Return restricted view if not enrolled?
        // CoursePage logic usually checks enrollment separately or sends full lesson list but hides content.
        // For now, return public info. Content like video URL might need restriction.
        // But since this is MVP refactor, let's return it.

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
