import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    try {
        const mockTests = await db.mockTest.findMany({
            where: {
                published: true
            },
            include: {
                lesson: {
                    include: {
                        course: true
                    }
                },
                attempts: userId ? {
                    where: { userId: userId },
                    orderBy: { completedAt: 'desc' }
                } : false
            }
        });

        const formattedTests = mockTests.map(test => {
            // Get latest attempt if any
            // Note: attempts is an array. If userId was not provided, it might not be included or be empty?
            // With 'false', it is not included.
            const userAttempts = (test as any).attempts || [];
            const latestAttempt = userAttempts.length > 0 ? userAttempts[0] : null;

            return {
                id: test.id,
                totalMarks: test.totalMarks,
                passingPercentage: test.passingPercentage,
                difficulty: test.difficulty,
                title: `${test.lesson.title} Quiz`,
                lesson: {
                    id: test.lesson.id,
                    title: test.lesson.title,
                    courseId: test.lesson.courseId,
                    course: {
                        title: test.lesson.course.title
                    }
                },
                attempts: userAttempts // return all or logic for latest
            };
        });

        return NextResponse.json(formattedTests);
    } catch (error) {
        console.error("Fetch mock tests error:", error);
        return NextResponse.json({ error: "Failed to fetch mock tests" }, { status: 500 });
    }
}
