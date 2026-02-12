import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const enrollments = await db.enrollment.findMany({
            where: {
                userId: user.id
            },
            include: {
                course: {
                    include: {
                        _count: {
                            select: { lessons: true }
                        }
                    }
                }
            },
            orderBy: {
                enrolledAt: "desc"
            }
        });

        const courses = enrollments.map((enrollment: any) => ({
            ...enrollment.course,
            progress: enrollment.progress // Include progress from enrollment
        }));

        return NextResponse.json(courses);
    } catch (error) {
        console.log("[COURSES_ENROLLED_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
