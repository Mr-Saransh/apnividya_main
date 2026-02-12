import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const courses = await db.course.findMany({
            where: {
                published: true,
            },
            include: {
                _count: {
                    select: { enrollments: true }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.log("[COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
