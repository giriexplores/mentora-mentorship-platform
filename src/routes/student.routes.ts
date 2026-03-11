import { Router } from 'express';
import { createStudent, getStudents } from '../controllers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

// All student routes require the caller to be an authenticated parent
const router = Router();

router.use(authenticate, requireRole('parent'));

router.post('/', createStudent);
router.get('/', getStudents);

export default router;
