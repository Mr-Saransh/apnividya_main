import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new NextResponse("Missing credentials", { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user || !user.passwordHash) {
            return new NextResponse("Invalid credentials", { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return new NextResponse("Invalid credentials", { status: 401 });
        }

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
        console.log("[LOGIN_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
