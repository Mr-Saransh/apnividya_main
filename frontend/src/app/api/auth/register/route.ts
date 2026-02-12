import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key";

export async function POST(req: Request) {
    try {
        const { email, password, fullName } = await req.json();

        if (!email || !password || !fullName) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new NextResponse("Email already exists", { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: "STUDENT" // Default role
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                karmaPoints: user.karmaPoints,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.log("[REGISTER_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
