import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
    try {
        const { lessonId } = await params;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const mockTest = await db.mockTest.findUnique({
            where: { lessonId: lessonId },
            include: {
                questions: {
                    select: {
                        id: true,
                        question: true,
                        optionA: true,
                        optionB: true,
                        optionC: true,
                        optionD: true,
                        // Do NOT select correctIndex
                    }
                }
            }
        });

        if (!mockTest) {
            return NextResponse.json({ error: "Mock test not found" }, { status: 404 });
        }

        let attempt = null;
        if (userId) {
            attempt = await db.mockTestAttempt.findFirst({
                where: {
                    mockTestId: mockTest.id,
                    userId: userId
                },
                orderBy: { completedAt: 'desc' }
            });
        }

        return NextResponse.json({ ...mockTest, attempt });
    } catch (error) {
        console.error("Error fetching mock test:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
    try {
        const { lessonId } = await params;
        const body = await req.json();
        const { userId, answers } = body; // answers: { [questionId]: selectedIndex }

        if (!userId || !answers) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // 1. Fetch full test with correct answers
        const mockTest = await db.mockTest.findUnique({
            where: { lessonId: lessonId },
            include: { questions: true }
        });

        if (!mockTest) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 });
        }

        // 2. Calculate Score
        let correctCount = 0;
        mockTest.questions.forEach((q) => {
            if (answers[q.id] === q.correctIndex) {
                correctCount++;
            }
        });

        const totalQuestions = mockTest.questions.length;
        const score = (correctCount / totalQuestions) * mockTest.totalMarks;
        const percentage = (correctCount / totalQuestions) * 100;
        const passed = percentage >= mockTest.passingPercentage;
        const status = passed ? "PASSED" : "FAILED";

        // 3. Save Attempt
        const attempt = await db.mockTestAttempt.create({
            data: {
                userId,
                mockTestId: mockTest.id,
                score: Math.round(score),
                percentage: parseFloat(percentage.toFixed(2)),
                status,
                completedAt: new Date()
            }
        });

        // 4. Update Karma
        let karmaChange = 0;
        let karmaReason = "";

        if (percentage >= 90) {
            karmaChange = 50;
            karmaReason = "Ace performance in Mock Test";
        } else if (percentage >= 75) {
            karmaChange = 30;
            karmaReason = "Great performance in Mock Test";
        } else if (passed) {
            karmaChange = 10;
            karmaReason = "Passed Mock Test";
        } else {
            karmaChange = -5;
            karmaReason = "Failed Mock Test";
        }

        // Transaction for Karma
        await db.$transaction([
            db.user.update({
                where: { id: userId },
                data: { karmaPoints: { increment: karmaChange } }
            }),
            db.karmaLedger.create({
                data: {
                    userId,
                    amount: karmaChange,
                    reason: `${karmaReason} - ${mockTest.lessonId ? "Lesson Test" : "Test"}`
                }
            })
        ]);

        // 5. Return Result
        return NextResponse.json({
            success: true,
            score,
            percentage,
            passed,
            correctCount,
            totalQuestions,
            karmaChange,
            correctAnswers: mockTest.questions.reduce((acc: any, q) => {
                acc[q.id] = q.correctIndex;
                return acc;
            }, {})
        });
    } catch (error) {
        console.error("Error submitting mock test:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
