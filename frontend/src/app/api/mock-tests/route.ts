import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Get enrolled course IDs
        const enrollments = await db.enrollment.findMany({
            where: { userId },
            select: { courseId: true },
        });
        const courseIds = enrollments.map((e) => e.courseId);

        // Fetch Mock Tests for lessons in enrolled courses
        const mockTests = await db.mockTest.findMany({
            where: {
                published: true,
                lesson: {
                    courseId: { in: courseIds },
                },
            },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        courseId: true,
                        course: {
                            select: { title: true },
                        },
                    },
                },
                attempts: {
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(mockTests);
    } catch (error) {
        console.log("[MOCK_TESTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
