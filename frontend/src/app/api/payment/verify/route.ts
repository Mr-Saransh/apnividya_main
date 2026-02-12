import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const { courseId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // 1. Update Payment Status
            const payment = await db.payment.findFirst({
                where: { razorpayOrderId: razorpay_order_id } // Ensure order matches
            });

            if (payment) {
                await db.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: "success",
                        razorpayPaymentId: razorpay_payment_id
                    }
                });
            }

            // 2. Enroll User if not enrolled
            const existingEnrollment = await db.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: courseId
                    }
                }
            });

            if (!existingEnrollment) {
                await db.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: courseId
                    }
                });
            }

            return NextResponse.json({ success: true });
        } else {
            return new NextResponse("Invalid Signature", { status: 400 });
        }
    } catch (error) {
        console.log("[PAYMENT_VERIFY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
