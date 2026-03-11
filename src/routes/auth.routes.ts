import { Router } from 'express';
import { signup, login, me } from '../controllers/auth.controllers';
import { authenticate } from '../middlewares/auth.middleware';

// Public: POST /signup, POST /login
// Protected: GET /me (requires valid JWT)
const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, me);

export default router;
