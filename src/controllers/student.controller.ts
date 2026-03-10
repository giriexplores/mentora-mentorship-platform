import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { insertUserSchema } from '../schema/users.schema';
import { hashPassword } from '../utils/hash';
import { sendSuccess, sendError, sendValidationError } from '../utils/response';
import { emailExists } from '../services/auth.services';
import { createStudent as persistStudent, getStudentsByParent } from '../services/student.services';

const createStudentSchema = insertUserSchema
  .pick({ name: true, email: true, password: true })
  .extend({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
  });

export async function createStudent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }

    const parentId = req.user!.userId;
    const { name, email, password } = parsed.data;

    if (await emailExists(email)) {
      sendError(res, 'Email already in use', 409);
      return;
    }

    const hashed = await hashPassword(password);
    const student = await persistStudent({ name, email, password: hashed, parentId });
    sendSuccess(res, { student }, 201);
  } catch (err) {
    next(err);
  }
}

export async function getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parentId = req.user!.userId;
    const students = await getStudentsByParent(parentId);
    sendSuccess(res, { students });
  } catch (err) {
    next(err);
  }
}
