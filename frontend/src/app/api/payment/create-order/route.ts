import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser(req);
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const { courseId } = await req.json();

        const course = await db.course.findUnique({
            where: { id: courseId, published: true }
        });

        if (!course) return new NextResponse("Course not found", { status: 404 });

        const options = {
            amount: course.price * 100, // in paise
            currency: "INR",
            receipt: `receipt_${course.id}_${user.id}`,
        };

        const order = await razorpay.orders.create(options);

        // Save initial payment record
        await db.payment.create({
            data: {
                userId: user.id,
                courseId: course.id,
                amount: course.price,
                razorpayOrderId: order.id,
                status: "pending"
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log("[PAYMENT_CREATE_ORDER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
