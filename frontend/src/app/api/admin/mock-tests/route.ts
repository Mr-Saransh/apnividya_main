import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { lessonId, title, googleFormLink, totalMarks, passingMarks, published } = await req.json();

        const quiz = await db.lessonQuiz.create({
            data: {
                lessonId,
                title,
                googleFormLink,
                totalMarks: parseInt(totalMarks),
                passingMarks: parseInt(passingMarks),
                published: published ?? false,
            }
        });

        return NextResponse.json(quiz);
    } catch (error: any) {
        console.log("[MOCK_TESTS_POST]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        console.log("[MOCK_TESTS_GET] DB Models:", Object.keys(db).filter(k => !k.startsWith('$')));
        const quizzes = await db.lessonQuiz.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                lesson: {
                    select: {
                        title: true,
                        course: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });
        return NextResponse.json(quizzes);
    } catch (error: any) {
        console.log("[MOCK_TESTS_GET]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
