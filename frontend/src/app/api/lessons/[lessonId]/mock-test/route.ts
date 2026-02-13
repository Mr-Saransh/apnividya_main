import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const quiz = await db.lessonQuiz.findUnique({
            where: {
                lessonId: lessonId,
                published: true,
            },
        });

        if (!quiz) {
            return new NextResponse("Assessment not found", { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error: any) {
        console.log("[LESSON_QUIZ_GET]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
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

        // Fetch Quiz details to validate score
        const quiz = await db.lessonQuiz.findUnique({
            where: {
                lessonId: lessonId,
                published: true,
            },
        });

        if (!quiz) {
            return new NextResponse("Assessment not found", { status: 404 });
        }

        // Validate score
        if (score > quiz.totalMarks || score < 0) {
            return new NextResponse("Invalid score", { status: 400 });
        }

        const percentage = (score / quiz.totalMarks) * 100;

        // Create Attempt
        const attempt = await db.lessonQuizAttempt.create({
            data: {
                userId,
                quizId: quiz.id,
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
                    reason: `Quiz: ${quiz.title} (${score}/${quiz.totalMarks})`
                }
            });
        }

        return NextResponse.json({ attempt, karmaAwarded: karmaPoints });
    } catch (error: any) {
        console.log("[LESSON_QUIZ_POST]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
