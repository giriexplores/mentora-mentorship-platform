import { Request, Response, NextFunction } from "express";
import { summarizeText } from "../utils/llm";
import { LLM_MODEL } from "../config/env";
import { sendError, sendSuccess, sendValidationError } from "../utils/response";
import z from "zod";

// Text must be at least 50 chars (meaningful content) and at most 10 000 chars (LLM token budget)
const textSchema = z.string().trim().min(50, "text must be at least 50 characters").max(10000, "text exceeds maximum length of 10000 characters");

/** Send plain text to the configured LLM and return a bullet-point summary. */
export async function summarize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = textSchema.safeParse(req.body.text);
    if (!parsed.success) {
      // Distinguish "too long" (413) from other validation failures (400)
    const issues = parsed.error.issues[0];
      const statusCode = issues.code === "too_big" ? 413 : 400;
      return sendValidationError(res, parsed.error, statusCode);
    }
    const text = parsed.data;

    const summary = await summarizeText(text);
    
    if (!summary) {
      sendError(res, "Failed to generate summary", 500);
    }

    sendSuccess(res, { summary, model: LLM_MODEL });
  } catch (err) {
    next(err);
  }
}
