import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

// POST / — parent only: books a lesson for one of their students
const router = Router();

router.post('/', authenticate, requireRole('parent'), createBooking);

export default router;
