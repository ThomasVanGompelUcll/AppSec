/**
 * @swagger
 *   components:
 *    schemas:
 *      Transaction:
 *          type: object
 *          properties:
 *            category:
 *              type: string
 *            type:
 *              type: string
 *            currency:
 *              type: string
 *            amount:
 *              type: number
 *            dateTime:
 *              type: string
 *              format: date-time
 */
import express, { NextFunction, Request, Response } from 'express';
import transactionService from '../service/transaction.service';
import { TransactionInput } from '../types';
import { z } from 'zod';

import dotenv from 'dotenv';
import { verifyToken } from '../util/jwt';
dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY as string;
        const decoded = verifyToken(token, secretKey) as unknown as { id: number; role: string };
        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

const transactionRouter = express.Router();

const transactionSchema = z.object({
  category: z.string().min(1),
  expense: z.boolean(),
  currency: z.enum(['EUR', 'USD', 'GBP']),
  amount: z.number().positive(),
  dateTime: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date' }),
  walletId: z.number().positive(),
  userId: z.number().positive(),
});

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get a list of all transactions.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: A list of transaction objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
transactionRouter.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: The created transaction object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 */
transactionRouter.post('/', async (req: Request, res: Response) => {
    const parsed = transactionSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    try {
        const transaction = await transactionService.createTransaction({
            ...parsed.data,
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * @swagger
 * /transactions/me:
 *   get:
 *     summary: Get the logged-in user's transactions.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transaction objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized, token missing or invalid.
 */
transactionRouter.get('/me', async (req: Request, res: Response) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        console.error('JWT_SECRET not loaded.');
        return res.status(500).json({ message: 'Server misconfiguration.' });
    }

    try {
        const decoded = await verifyToken(token, secretKey) as { id: number };
        const transactions = await transactionService.getTransactionByUserId(decoded.id);

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ message: 'Transactions not found.' });
        }

        res.json(transactions);
    } catch (error) {
        if (error instanceof Error && error.message === 'Token has expired') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        console.error('Token verification failed:', error instanceof Error ? error.message : error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

export { transactionRouter };