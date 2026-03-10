import { Request, Response, NextFunction } from 'express';
import { insertLessonSchema } from '../schema/lessons.schema';
import { sendSuccess, sendValidationError } from '../utils/response';
import { createLesson as persistLesson } from '../services/lesson.services';

const createLessonSchema = insertLessonSchema.pick({ title: true, description: true });

export async function createLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createLessonSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }

    const mentorId = req.user!.userId;
    const lesson = await persistLesson({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      mentorId,
    });
    sendSuccess(res, { lesson }, 201);
  } catch (err) {
    next(err);
  }
}
