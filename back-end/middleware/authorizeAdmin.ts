import { Request, Response, NextFunction } from 'express';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }

    next();
};