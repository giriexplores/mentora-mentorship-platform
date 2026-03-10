import { Router } from "express";
import { summarize } from "../controllers/llm.controller";
import { llmRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.post("/summarize", llmRateLimiter, summarize);

export default router;
