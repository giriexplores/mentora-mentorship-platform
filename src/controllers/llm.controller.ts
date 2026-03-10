import { Request, Response, NextFunction } from "express";
import { summarizeText } from "../utils/llm";
import { LLM_MODEL } from "../config/env";
import { sendSuccess, sendValidationError } from "../utils/response";
import z from "zod";

const textSchema = z.string().trim().min(50, "text must be at least 50 characters").max(10000, "text exceeds maximum length of 10000 characters");

export async function summarize(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = textSchema.safeParse(req.body.text);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }
    const text = parsed.data;

    const summary = await summarizeText(text);
    sendSuccess(res, { summary, model: LLM_MODEL });
  } catch (err) {
    next(err);
  }
}
