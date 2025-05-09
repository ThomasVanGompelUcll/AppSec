import express, { Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';
import jwt from 'jsonwebtoken';
import { User } from '../model/user';
import dotenv from 'dotenv';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { authorizeAdmin } from '../middleware/authorizeAdmin';
import { authenticate } from './transaction.routes';

dotenv.config();

export const TOKEN_EXPIRATION = '1m';
export const REFRESH_TOKEN_EXPIRATION = '7d';

const userRouter = express.Router();

const userSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    age: z.number().int().min(16).max(120),
    email: z.string().email(),
    password: z.string().min(8),
    phoneNumber: z.string().min(10),
    personalNumber: z.number(),
    role: z.enum(['admin', 'owner', 'user']),
});

const signAccessToken = (id: number) =>
    jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: TOKEN_EXPIRATION });

const signRefreshToken = (id: number) =>
    jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_TOKEN_EXPIRATION  });

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users.
 *     responses:
 *       200:
 *         description: All user objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the logged-in user's details.
 *     responses:
 *       200:
 *         description: The logged-in user's details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token missing or invalid.
 */
userRouter.get('/me', async (req: Request, res: Response) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const secretKey = process.env.JWT_SECRET;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET;

    if (!secretKey || !refreshSecretKey) {
        return res.status(500).json({ message: 'Server misconfiguration.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id: number };
        const user = await userService.getUserById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        if ((error as Error).name === 'TokenExpiredError') {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token missing.' });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, refreshSecretKey) as { id: number };
                const user = await userService.getUserById(decodedRefresh.id);

                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                const newAccessToken = signAccessToken(user.id);

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 60 * 1000,
                });

                res.json({ user });
            } catch {
                return res.status(401).json({ message: 'Invalid or expired refresh token.' });
            }
        } else {
            res.status(401).json({ message: 'Invalid or expired token.' });
        }
    }
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get a user by id.
 *      parameters: 
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *          required: true
 *          description: The user id
 *      responses:
 *          200:
 *              description: A user object
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ status: 'error' });
    }
});

userRouter.post('/', async (req: Request, res: Response) => {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    try {
        const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
        const user = await userService.createUser({
            ...parsed.data,
            password: hashedPassword,
        });

        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json(user);
    } catch {
        res.status(400).json({ message: 'User creation failed' });
    }
});

userRouter.delete('/:id', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'Invalid user ID.' });
    }

    try {
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
});

userRouter.patch('/:id/role', authenticate, authorizeAdmin, async (req: Request, res: Response) => {
    const { role } = req.body;
    const userId = parseInt(req.params.id);

    if (!['admin', 'owner', 'user'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const updatedUser = await userService.updateUserRole(userId, role);
        res.status(200).json(updatedUser);
    } catch {
        res.status(500).json({ message: 'Failed to update role' });
    }
});

export { userRouter };
