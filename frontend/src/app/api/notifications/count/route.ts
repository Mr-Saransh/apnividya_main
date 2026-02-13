import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const count = await db.notification.count({
            where: {
                userId: user.id,
                read: false
            }
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.log("[NOTIFICATION_COUNT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
