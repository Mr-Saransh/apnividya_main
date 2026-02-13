import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser(req);

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const notification = await db.notification.update({
            where: {
                id,
                userId: user.id
            },
            data: {
                read: true
            }
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.log("[NOTIFICATION_READ_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
