import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { insertUserSchema } from '../schema/users.schema';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError, sendValidationError } from '../utils/response';
import { findUserByEmail, findUserById, createUser, emailExists } from '../services/auth.services';

const signupSchema = insertUserSchema
  .pick({ name: true, email: true, password: true, role: true })
  .extend({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(['parent', 'mentor']),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password and confirmPassword do not match',
    path: ['confirmPassword'],
  });

const loginSchema = insertUserSchema.pick({ email: true, password: true }).extend({
  email: z.email(),
});

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }

    const { name, email, password, role } = parsed.data;

    if (await emailExists(email)) {
      sendError(res, 'Email already in use', 409);
      return;
    }

    const hashed = await hashPassword(password);
    const user = await createUser({ name, email, password: hashed, role });
    const token = signToken({ userId: user.id, role: user.role });
    sendSuccess(res, { user, token }, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }

    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const { password: _, ...publicUser } = user;
    const token = signToken({ userId: user.id, role: user.role });
    sendSuccess(res, { token, user: publicUser });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await findUserById(req.user!.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
}
