import { Response } from 'express';
import { ZodError } from 'zod';

/** Send a JSON success response with the given data payload and status code (default 200). */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data });
}

/** Send a JSON error response with a message and status code (default 500). */
export function sendError(res: Response, message: string, statusCode = 500): void {
  res.status(statusCode).json({ success: false, message });
}

/** Send a structured Zod validation error response (default 400). */
export function sendValidationError(res: Response, err: ZodError, statusCode = 400): void {
  res.status(statusCode).json({ success: false, message: 'Validation error', errors: err.issues });
}
