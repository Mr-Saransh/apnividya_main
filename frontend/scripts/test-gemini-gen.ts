
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) { console.error("No key"); process.exit(1); }

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(name: string) {
    console.log(`\n--- Testing ${name} ---`);
    try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Test");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (e: any) {
        console.log("FAILED:", e.message || e);
        if (e.cause) console.log("CAUSE:", e.cause);
    }
}

async function run() {
    await testModel("gemini-1.5-flash");
}
run();
