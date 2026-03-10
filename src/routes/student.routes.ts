import { Router } from 'express';
import { createStudent, getStudents } from '../controllers/student.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate, requireRole('parent'));

router.post('/', createStudent);
router.get('/', getStudents);

export default router;
