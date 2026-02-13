import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const tests = await db.mockTest.findMany({
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
                },
                questions: {
                    select: {
                        id: true
                    }
                }
            }
        });
        return NextResponse.json(tests);
    } catch (error: any) {
        console.log("[MOCK_TESTS_GET]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
