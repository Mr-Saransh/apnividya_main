import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { lessonId, title, googleFormLink, totalMarks, passingMarks, published } = await req.json();

        const mockTest = await db.mockTest.create({
            data: {
                lessonId,
                title,
                googleFormLink,
                totalMarks: parseInt(totalMarks),
                passingMarks: parseInt(passingMarks),
                published: published ?? false,
            }
        });

        return NextResponse.json(mockTest);
    } catch (error) {
        console.log("[MOCK_TESTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const mockTests = await db.mockTest.findMany({
            orderBy: { createdAt: "desc" }, // Order by newest
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
        return NextResponse.json(mockTests);
    } catch (error) {
        console.log("[MOCK_TESTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
