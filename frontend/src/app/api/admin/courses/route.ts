import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courses = await db.course.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { lessons: true }
                }
            }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.log("[COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, description, level, language, price, thumbnailUrl, published } = body;

        const course = await db.course.create({
            data: {
                title,
                description,
                level,
                language,
                price: parseFloat(price) || 0,
                thumbnail: thumbnailUrl,
                published: !!published,
                instructorId: user.id, // Admin is the instructor
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
