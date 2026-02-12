import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const mockTest = await db.mockTest.findUnique({
            where: {
                lessonId: lessonId,
                published: true,
            },
        });

        if (!mockTest) {
            return new NextResponse("Mock Test not found", { status: 404 });
        }

        return NextResponse.json(mockTest);
    } catch (error) {
        console.log("[LESSON_MOCK_TEST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const { userId, score } = await req.json();

        if (!userId || score === undefined) {
            return new NextResponse("Missing data", { status: 400 });
        }

        // Fetch Mock Test details to validate score
        const mockTest = await db.mockTest.findUnique({
            where: {
                lessonId: lessonId,
                published: true,
            },
        });

        if (!mockTest) {
            return new NextResponse("Mock Test not found", { status: 404 });
        }

        // Validate score
        if (score > mockTest.totalMarks || score < 0) {
            return new NextResponse("Invalid score", { status: 400 });
        }

        const percentage = (score / mockTest.totalMarks) * 100;

        // Create Attempt
        const attempt = await db.mockTestAttempt.create({
            data: {
                userId,
                mockTestId: mockTest.id,
                score,
                percentage,
            },
        });

        // Award Karma
        let karmaPoints = 0;
        if (percentage >= 90) karmaPoints = 50;
        else if (percentage >= 75) karmaPoints = 30;
        else if (percentage >= 50) karmaPoints = 10;

        if (karmaPoints > 0) {
            // Update user
            await db.user.update({
                where: { id: userId },
                data: { karmaPoints: { increment: karmaPoints } }
            });

            // Add to Ledger
            await db.karmaLedger.create({
                data: {
                    userId,
                    amount: karmaPoints,
                    reason: `Mock Test: ${mockTest.title} (${score}/${mockTest.totalMarks})`
                }
            });
        }

        return NextResponse.json({ attempt, karmaAwarded: karmaPoints });
    } catch (error) {
        console.log("[LESSON_MOCK_TEST_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
