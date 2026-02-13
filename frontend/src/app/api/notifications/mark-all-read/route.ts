import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await db.notification.updateMany({
            where: {
                userId: user.id,
                read: false
            },
            data: {
                read: true
            }
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[NOTIFICATIONS_MARK_ALL_READ_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
