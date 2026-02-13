import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateMockTestQuestions(
    courseName: string,
    lessonName: string,
    difficulty: string,
    count: number
) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Create a mock test with ${count} multiple-choice questions for the following topic:
    Course: ${courseName}
    Lesson: ${lessonName}
    Difficulty: ${difficulty}

    Return strict JSON format only. Do not include markdown code block formatting like \`\`\`json.
    Structure:
    [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0 // index of correct option (0-3)
      }
    ]
    Ensure there are exactly 4 options per question.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up if markdown is included despite instructions
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate questions using Gemini.");
    }
}
