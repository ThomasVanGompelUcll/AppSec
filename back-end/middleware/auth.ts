// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../util/jwt';

const SECRET_KEY = process.env.JWT_SECRET || 'defaultSecret';

const publicPaths = [
  '/login',
  '/register',
  '/status',
  '/docs',
  /^\/docs\/.*/,
];

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  if (publicPaths.some(path => req.path.match(path))) {
    return next();
  }

  const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = verifyToken(token);
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'role' in decoded) {
      (req as any).user = { id: decoded.id, role: decoded.role };
    } else {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
