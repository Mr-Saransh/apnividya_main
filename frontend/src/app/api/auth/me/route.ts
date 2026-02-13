import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get counts for profile stats
        const userWithStats = await db.user.findUnique({
            where: { id: user.id },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        posts: true,
                        comments: true,
                    }
                }
            }
        });

        return NextResponse.json(userWithStats);
    } catch (error) {
        console.log("[AUTH_ME_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { fullName, bio, avatar } = body;

        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: {
                fullName,
                bio,
                avatar
            },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        posts: true,
                        comments: true,
                    }
                }
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log("[AUTH_ME_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
