import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function requireRole(...roles: Array<'parent' | 'mentor' | 'student'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden: insufficient permissions', 403);
      return;
    }
    next();
  };
}
