import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        title: "Daily Goal",
        description: "Complete 1 lesson today to keep your streak alive!",
        totalQuestions: 1,
        completed: 0,
        progress: 0,
    });
}
