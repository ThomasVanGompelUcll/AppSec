/**
 * @swagger
 *   components:
 *    schemas:
 *      Subscription:
 *          type: object
 *          properties:
 *            subscriptionId:
 *              type: integer
 *            description:
 *              type: string
 *            amount:
 *              type: number
 *            startDate:
 *              type: string
 *              format: date-time
 *            endDate:
 *              type: string
 *              format: date-time
 *            expense:
 *              type: Boolean
 *            frequency:
 *              type: string
 *            Currency:
 *              type: string
 *            wallet:
 *              type: Wallet
 */
import express, { NextFunction, Request, Response } from 'express';
import subscriptionService from '../service/subscription.service';
import { SubscriptionInput } from '../types';
import { z } from 'zod';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const subscriptionRouter = express.Router();

const subscriptionSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date' }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date' }),
  expense: z.boolean(),
  frequency: z.string().min(1),
  currency: z.string().min(1),
  walletId: z.number().positive(),
  userId: z.number().positive(),
});

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get a list of all subscriptions.
 *     tags:
 *       - Subscriptions
 *     responses:
 *       200:
 *         description: A list of subscription objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
subscriptionRouter.get('/', async (req: Request, res: Response) => {
    try {
        const subscriptions = await subscriptionService.getAllSubscriptions();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

subscriptionRouter.get('/me', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }) as { id: number };

        const subscriptions = await subscriptionService.getSubscriptionByUserId(decoded.id);

        if (!subscriptions) {
            return res.status(404).json({ message: 'Subscriptions not found.' });
        }

        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Add a new subscription to a wallet.
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionInput'
 *     responses:
 *       201:
 *         description: The created subscription object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 */
subscriptionRouter.post('/', async (req: Request, res: Response) => {
  const parsed = subscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
  }

  try {
    const subscription = await subscriptionService.createSubscription({
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /{subscriptionId}:
 *   delete:
 *     summary: Delete a subscription from a wallet.
 *     tags:
 *       - Subscriptions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The subscription ID to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The user ID who owns the subscription
 *             required:
 *               - userId
 *     responses:
 *       204:
 *         description: Subscription deleted successfully.
 */
subscriptionRouter.delete('/:subscriptionId', async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;
        const { userId } = req.body;

        if (!subscriptionId || isNaN(Number(subscriptionId))) {
            return res.status(400).json({ message: 'Invalid subscription ID.' });
        }

        if (!userId || isNaN(Number(userId))) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        await subscriptionService.deleteSubscription(Number(subscriptionId), userId);

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting subscription:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export { subscriptionRouter };