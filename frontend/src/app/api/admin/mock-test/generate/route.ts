import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { lessonId, difficulty, count } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Create a multiple-choice mock test.
      Topic: ${lesson.title} (Course: ${lesson.course.title})
      Difficulty: ${difficulty}
      Number of Questions: ${count}

      Return purely a JSON array of objects. Do not include any markdown formatting (like \`\`\`json).
      Ensure strict adherence to this schema:
      [
        {
          "question": "Question text here?",
          "options": [
            "Option A text",
            "Option B text",
            "Option C text",
            "Option D text"
          ],
          "correctIndex": 0  // 0-3
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean potential markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Extract JSON array if surrounded by other text
    const jsonStartIndex = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      text = text.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    const questions = JSON.parse(text);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Gemini Generation Error Details:", error);
    return NextResponse.json({ error: `Failed to generate questions: ${error.message || error}` }, { status: 500 });
  }
}
