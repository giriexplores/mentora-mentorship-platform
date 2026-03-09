import { Response } from 'express';
import { ZodError } from 'zod';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data });
}

export function sendError(res: Response, message: string, statusCode = 500): void {
  res.status(statusCode).json({ success: false, message });
}

export function sendValidationError(res: Response, err: ZodError): void {
  res.status(400).json({ success: false, message: 'Validation error', errors: err.issues });
}
