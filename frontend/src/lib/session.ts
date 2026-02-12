import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback_key";

export async function getCurrentUser(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // Optional: caching layer or just DB lookup
        const user = await db.user.findUnique({
            where: { id: decoded.userId }
        });

        return user;
    } catch (error) {
        return null;
    }
}
