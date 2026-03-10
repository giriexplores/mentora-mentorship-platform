import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, LLM_MODEL } from "../config/env";

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function summarizeText(text: string): Promise<string> {
  try {
    const prompt = `
Summarize the following text.

Requirements:
- Provide the summary as 3 to 6 bullet points
- Be concise
- Do not exceed 120 words total

Text:
${text}
`;
    const response = await ai.models.generateContent({
      model: LLM_MODEL,
      contents: prompt,
    });

    return response.text ?? "No summary generated.";
  } catch (error) {
      throw new Error("LLM summarization failed");
  }
}
