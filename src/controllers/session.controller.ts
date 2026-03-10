import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { insertSessionSchema } from '../schema/sessions.schema';
import { sendSuccess, sendValidationError } from '../utils/response';
import {
  createSession as persistSession,
  getSessionsByLesson as fetchSessionsByLesson,
} from '../services/session.services';

const createSessionSchema = insertSessionSchema
  .pick({ lessonId: true, topic: true, summary: true, date: true })
  .extend({
    date: z.date(),
  });

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }

    const { lessonId, date, topic, summary } = parsed.data;
    const session = await persistSession({ lessonId, date: new Date(date), topic, summary });
    sendSuccess(res, { session }, 201);
  } catch (err) {
    next(err);
  }
}

export async function getSessionsByLesson(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id as string;
    const sessions = await fetchSessionsByLesson(id);
    sendSuccess(res, { sessions });
  } catch (err) {
    next(err);
  }
}
