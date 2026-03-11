import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { NODE_ENV } from '../config/env';

/**
 * Global error-handling middleware.
 * - ZodErrors (validation failures) are formatted as 400 with field-level details.
 * - All other errors fall through with the response status already set by the caller,
 *   defaulting to 500 for unexpected failures.
 * - Stack traces are included in development mode only.
 */
export default function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.issues,
    });
    return;
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Log unexpected server-side errors; client-facing 4xx errors are not logged
  if (statusCode >= 500) {
    console.error(`[ERROR] ${err.message}`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
}
