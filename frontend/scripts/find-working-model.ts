
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) { console.error("No key"); process.exit(1); }

const genAI = new GoogleGenerativeAI(apiKey);

const candidates = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-exp", // Often has quota
    "gemini-1.5-flash",     // Just in case
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-pro"
];

async function testModel(name: string) {
    process.stdout.write(`Testing ${name}... `);
    try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log("SUCCESS! ✅");
        return true;
    } catch (e: any) {
        const msg = e.message || e.toString();
        if (msg.includes("404")) console.log("Not Found (404) ❌");
        else if (msg.includes("429")) console.log("Quota Exceeded (429) ❌");
        else console.log(`Error: ${msg.substring(0, 50)}... ❌`);
        return false;
    }
}

async function run() {
    console.log("Searching for working model...");
    for (const model of candidates) {
        const works = await testModel(model);
        if (works) {
            console.log(`\n>>> FOUND WORKING MODEL: ${model} <<<`);
            break;
        }
    }
}
run();
