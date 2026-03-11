import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export interface JwtPayload {
  userId: string;
  role: 'parent' | 'mentor' | 'student';
}

/** Sign a JWT that expires in 7 days. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/** Verify a JWT and return its decoded payload. Throws if the token is invalid or expired. */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
