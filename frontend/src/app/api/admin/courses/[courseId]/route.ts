import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const user = await getCurrentUser(req);
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;
        const course = await db.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    orderBy: { order: "asc" }
                },
                _count: {
                    select: { lessons: true }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error: any) {
        console.error("[COURSE_GET] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const user = await getCurrentUser(req);
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;
        const body = await req.json();

        // Map thumbnailUrl to thumbnail for Prisma
        const { thumbnailUrl, ...rest } = body;
        const updateData = {
            ...rest,
            thumbnail: thumbnailUrl !== undefined ? thumbnailUrl : rest.thumbnail
        };

        const course = await db.course.update({
            where: { id: courseId },
            data: updateData
        });

        return NextResponse.json(course);
    } catch (error: any) {
        console.error("[COURSE_PATCH] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const user = await getCurrentUser(req);
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await params;

        // Note: Cascade delete should be handled by schema or manually here
        // For safety, we delete the course
        await db.course.delete({
            where: { id: courseId }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("[COURSE_DELETE] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
