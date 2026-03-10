import { Router } from 'express';
import { createLesson } from '../controllers/lesson.controller';
import { getSessionsByLesson } from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, requireRole('mentor'), createLesson);
router.get('/:id/sessions', authenticate, getSessionsByLesson);

export default router;
