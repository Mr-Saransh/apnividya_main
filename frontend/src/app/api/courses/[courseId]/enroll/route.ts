import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                published: true,
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const existingEnrollment = await db.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            }
        });

        if (existingEnrollment) {
            return new NextResponse("Already enrolled", { status: 400 });
        }

        const enrollment = await db.enrollment.create({
            data: {
                userId: user.id,
                courseId: courseId,
            }
        });

        return NextResponse.json(enrollment);
    } catch (error) {
        console.log("[COURSE_ENROLL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
