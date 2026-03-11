import { Router } from 'express';
import { createSession } from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

// POST / — mentor only: records a completed or upcoming session for a lesson
const router = Router();

router.post('/', authenticate, requireRole('mentor'), createSession);

export default router;
