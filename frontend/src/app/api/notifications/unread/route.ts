import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notifications = await db.notification.findMany({
            where: {
                userId: user.id,
                read: false
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.log("[NOTIFICATIONS_UNREAD_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
