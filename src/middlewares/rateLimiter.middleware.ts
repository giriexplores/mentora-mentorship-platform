import rateLimit from "express-rate-limit";

/**
 * Rate limiter for LLM endpoints: max 10 requests per IP per minute.
 * Prevents abuse of the paid Gemini API quota.
 */
export const llmRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 1 minute.",
  }
});
