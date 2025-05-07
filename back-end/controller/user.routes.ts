/**
 * @swagger
 *   components:
 *    schemas:
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            age:
 *              type: number
 *            email:
 *              type: string
 *              format: email
 *            password:
 *              type: string
 *            phoneNumber:
 *              type: string
 *            personalNumber:
 *              type: string
 *              format: int64
 *            role:
 *              type: string
 *            wallets:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Wallet'
 *            transactions:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Transaction'
 *      Wallet:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            balance:
 *              type: number
 *      Transaction:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            amount:
 *              type: number
 *            date:
 *              type: string
 *              format: date-time
 *      UserInput:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *              format: email
 *            password:
 *              type: string
 *            phoneNumber:
 *              type: string
 *            personalNumber:
 *              type: string
 *              format: int64
 *            role:
 *              type: string
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';
import jwt from 'jsonwebtoken';
import { User } from '../model/user'; // Adjust according to your model
import dotenv from 'dotenv';
import { z } from 'zod';
import bcrypt from 'bcrypt';

dotenv.config();

const userRouter = express.Router();

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT secret key is not configured properly.');
}

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
    console.log("testing")
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
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        // Restrict to a single algorithm for token verification
        const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] }) as { id: number };

        const user = await userService.getUserById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Invalid or expired token.' });
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

        // Validate the ID parameter
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
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
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'User creation failed' });
    }
});

export { userRouter };