
import { db } from "@/lib/db";

async function testConnection() {
    console.log("Testing DB connection...");
    try {
        const userCount = await db.user.count();
        console.log(`Connection Successful! Found ${userCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error("DB Connection Failed:", error);
        process.exit(1);
    }
}

testConnection();
