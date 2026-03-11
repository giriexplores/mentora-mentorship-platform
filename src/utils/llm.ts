import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, LLM_MODEL } from "../config/env";

// Singleton GenAI client; reused across requests to avoid repeated initialisation overhead
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

/**
 * Send `text` to Google Gemini and return a 3–6 bullet-point summary.
 * Returns null if the model returns an empty response or if the API call fails.
 */
export async function summarizeText(text: string): Promise<string | null> {
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

    if (!response.text) {
      return null;
    }

    return response.text;
  } catch (error) {
    console.error("[LLM] summarizeText failed:", error);
    return null;
  }
}
