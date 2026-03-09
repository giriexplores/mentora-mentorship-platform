import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Unauthorized: missing or invalid token', 401);
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Unauthorized: invalid or expired token', 401);
  }
}
