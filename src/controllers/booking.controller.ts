import { Request, Response, NextFunction } from 'express';
import { insertBookingSchema } from '../schema/bookings.schema';
import { sendSuccess, sendError, sendValidationError } from '../utils/response';
import { createBooking as persistBooking } from '../services/booking.services';
import { findStudentByIdAndParent } from '../services/student.services';
import { lessonExists } from '../services/lesson.services';

// Only studentId and lessonId are required from the request body
const createBookingSchema = insertBookingSchema.pick({ studentId: true, lessonId: true });

/**
 * Create a lesson booking for a student owned by the authenticated parent.
 * Validates that the student belongs to the parent and the lesson exists before persisting.
 */
export async function createBooking(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      sendValidationError(res, parsed.error);
      return;
    }

    const parentId = req.user!.userId;
    const { studentId, lessonId } = parsed.data;

    const student = await findStudentByIdAndParent(studentId, parentId);
    if (!student) {
      sendError(res, 'Student not found or does not belong to you', 403);
      return;
    }

    if (!(await lessonExists(lessonId))) {
      sendError(res, 'Lesson not found', 404);
      return;
    }

    const booking = await persistBooking({ studentId, lessonId });
    sendSuccess(res, { booking }, 201);
  } catch (err) {
    next(err);
  }
}
