import { Router } from 'express';
import { createSession } from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, requireRole('mentor'), createSession);

export default router;
