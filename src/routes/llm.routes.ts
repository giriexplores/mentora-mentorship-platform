import { Router } from "express";
import { summarize } from "../controllers/llm.controller";
import { llmRateLimiter } from "../middlewares/rateLimiter.middleware";

// POST /summarize — no auth required; rate-limited at 10 req/min per IP
const router = Router();

router.post("/summarize", llmRateLimiter, summarize);

export default router;
