import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const posts = await db.communityPost.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.log("[COMMUNITY_POSTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content } = await req.json();

        if (!title || !content) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const post = await db.communityPost.create({
            data: {
                title,
                content,
                userId: user.id,
            },
        });

        // Award Karma for posting (e.g., +2 points)
        await db.user.update({
            where: { id: user.id },
            data: { karmaPoints: { increment: 2 } }
        });

        await db.karmaLedger.create({
            data: {
                userId: user.id,
                amount: 2,
                reason: "Created community post"
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.log("[COMMUNITY_POSTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
