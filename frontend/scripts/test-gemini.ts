
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) { console.error("No key"); process.exit(1); }

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.models) {
            console.log("MODELS:");
            data.models.forEach((m: any) => console.log(m.name.replace('models/', '')));
        } else {
            console.log("ERROR:", data);
        }
    } catch (e) { console.error(e); }
}
listModels();
