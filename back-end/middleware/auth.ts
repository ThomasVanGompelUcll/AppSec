// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, isTokenBlacklisted, ensureSecrets } from '../util/jwt';

const publicPaths = [/^\/login$/, /^\/signup$/, /^\/public/];

export async function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  if (publicPaths.some(path => req.path.match(path))) {
    return next();
  }

  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    await ensureSecrets();
    const secretKey = process.env.JWT_SECRET || 'defaultSecret';

    const decoded = await verifyToken(token, secretKey);

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
}
