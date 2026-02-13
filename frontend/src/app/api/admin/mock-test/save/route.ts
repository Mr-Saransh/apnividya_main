import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lessonId, totalMarks, passingPercentage, difficulty, questions, published } = body;

        // Validate essential fields
        if (!lessonId || !questions || !Array.isArray(questions)) {
            return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
        }

        // Check for existing mock test and delete if present (constraint: 1 per lesson)
        const existingTest = await db.mockTest.findUnique({
            where: { lessonId: lessonId }
        });

        if (existingTest) {
            // Questions cascade delete automatically due to relation setting?
            // Check schema: `onDelete: Cascade` was added to `MockQuestion` relation?
            // Yes: `mockTest MockTest @relation(fields: [mockTestId], references: [id], onDelete: Cascade)`

            // So deleting mockTest is enough.
            await db.mockTest.delete({
                where: { id: existingTest.id }
            });
        }

        // Create new test
        const newTest = await db.mockTest.create({
            data: {
                lessonId,
                totalMarks: Number(totalMarks),
                passingPercentage: Number(passingPercentage),
                difficulty,
                published: published ?? false,
                questions: {
                    create: questions.map((q: any) => ({
                        question: q.question,
                        optionA: q.options[0],
                        optionB: q.options[1],
                        optionC: q.options[2],
                        optionD: q.options[3],
                        correctIndex: q.correctIndex
                    }))
                }
            },
            include: {
                questions: true
            }
        });

        return NextResponse.json(newTest);
    } catch (error) {
        console.error("Error saving mock test:", error);
        return NextResponse.json({ error: "Failed to save mock test" }, { status: 500 });
    }
}
