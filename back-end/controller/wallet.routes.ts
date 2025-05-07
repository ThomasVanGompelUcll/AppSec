/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         age:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *         phoneNumber:
 *           type: string
 *         personalNumber:
 *           type: integer
 *         role:
 *           type: string
 *           enum: [admin, owner, user]
 *         ownedWallets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Wallet'
 *         sharedWallets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Wallet'
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *     UserInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         age:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *         phoneNumber:
 *           type: string
 *         personalNumber:
 *           type: integer
 *         role:
 *           type: string
 *           enum: [admin, owner, user]
 *     Wallet:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         currency:
 *           type: string
 *           enum: [EUR, USD, GBP]
 *         creationDate:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *         owner:
 *           $ref: '#/components/schemas/User'
 *         sharedUsers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *         subscriptions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Subscription'
 *     WalletInput:
 *       type: object
 *       properties:
 *         currency:
 *           type: string
 *           enum: [EUR, USD, GBP]
 *         amount:
 *           type: number
 *         ownerId:
 *           type: integer
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         category:
 *           type: string
 *         expense:
 *           type: boolean
 *         currency:
 *           type: string
 *           enum: [EUR, USD, GBP]
 *         amount:
 *           type: number
 *         dateTime:
 *           type: string
 *           format: date-time
 *         walletId:
 *           type: integer
 *         userId:
 *           type: integer
 *     TransactionInput:
 *       type: object
 *       properties:
 *         category:
 *           type: string
 *         expense:
 *           type: boolean
 *         currency:
 *           type: string
 *           enum: [EUR, USD, GBP]
 *         amount:
 *           type: number
 *         dateTime:
 *           type: string
 *           format: date-time
 *         walletId:
 *           type: integer
 *         userId:
 *           type: integer
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         expense:
 *           type: boolean
 *         frequency:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *         currency:
 *           type: string
 *           enum: [EUR, USD, GBP]
 *         walletId:
 *           type: integer
 *         lastTransactionDate:
 *           type: string
 *           format: date-time
 *     SubscriptionInput:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         expense:
 *           type: boolean
 *         frequency:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *         currency:
 *           type: string
 *           enum: [EUR, USD, GBP]
 *         walletId:
 *           type: integer
 */

import express, { NextFunction, Request, Response } from 'express';
import walletService from '../service/wallet.service';
import { SubscriptionInput, TransactionInput, WalletInput } from '../types';
import subscriptionService from '../service/subscription.service';
import { z } from 'zod';

import { verifyToken } from '../util/jwt';
import dotenv from 'dotenv';
dotenv.config();

const walletSchema = z.object({
  name: z.string().min(1),
  currency: z.enum(['EUR', 'USD', 'GBP']),
  amount: z.number().positive(),
  ownerId: z.number().positive(),
});

const walletRouter = express.Router();
/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get a list of all wallets.
 *     tags:
 *       - Wallets
 *     responses:
 *       200:
 *         description: A list of wallet objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 */
walletRouter.get('/', async (req: Request, res: Response) => {
    try {
      const wallets = await walletService.getAllWallets();
      subscriptionService.processAllSubscriptions();
      res.status(200).json(wallets);
    } catch (error) {
        res.status(400).json({ status: 'error' });    }
  });
  
walletRouter.get('/me', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = verifyToken(token) as { id: number, role: string };

        const wallets = await walletService.getWalletByUserId(decoded.id);

        if (!wallets) {
            return res.status(404).json({ message: 'wallets not found.' });
        }

        res.status(200).json(wallets);
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});
  
  /**
   * @swagger
   * /wallets/{walletId}/share/{userId}:
   *   post:
   *     summary: Add a user to a shared wallet.
   *     tags:
   *       - Wallets
   *     parameters:
   *       - in: path
   *         name: walletId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The wallet ID
   *       - in: path
   *         name: userId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The user ID to add to the wallet
   *     responses:
   *       200:
   *         description: User added to the shared wallet successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  walletRouter.post('/:walletId/share/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const walletId = Number(req.params.walletId);
      const userId = Number(req.params.userId);
      const result = await walletService.addUserToSharedWallet(walletId, userId);
      res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ status: 'error' });    }
  });
  
  /**
   * @swagger
   * /wallets:
   *   post:
   *     summary: Create a new wallet.
   *     tags:
   *       - Wallets
   *     parameters:
   *       - in: path
   *         name: walletId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The wallet ID
   *       - in: path
   *         name: userId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The user ID to add to the wallet
   *     responses:
   *       201:
   *         description: The created wallet object.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Wallet'
   */
walletRouter.post('/', async (req: Request, res: Response) => {
    const parsed = walletSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    try {
        const wallet = await walletService.createWallet(parsed.data);
        res.status(201).json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

  /**
   * @swagger
   * /wallets/{walletId}/remove/{userId}:
   *   delete:
   *     summary: Remove a user from a wallet.
   *     tags:
   *       - Wallets
   *     parameters:
   *       - in: path
   *         name: walletId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The wallet ID
   *       - in: path
   *         name: userId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The user ID to remove from the wallet
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: integer
   *                 description: The user ID who must be removed
   *             required:
   *               - userId
   *     responses:
   *       204:
   *         description: Subscription deleted successfully.
   */
walletRouter.delete('/:walletId/remove/:userId', async (req: Request, res: Response) => {
    try {
      const walletId = Number(req.params.walletId);
      const userId = Number(req.params.userId);
      await walletService.addUserToSharedWallet(walletId, userId);
  
      res.status(204).send();
    } catch (error) {
        res.status(400).json({ status: 'error' });    }
});

/**
 * @swagger
 * /wallet/{id}:
 *  get:
 *      summary: Get a wallet by userId.
 *      parameters: 
 *        - in: path
 *          name: id
 *          schema:
 *              type: integer
 *          required: true
 *          description: The user id
 *      responses:
 *          200:
 *              description: A wallet list
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Wallet'
 */
walletRouter.get('/:id', async (req: Request, res: Response) => {
  try {
      const userId = parseInt(req.params.id);
      const user = await walletService.getWalletByUserId(userId);
      res.status(200).json(user);
  } catch (error) {
      res.status(404).json({ status: 'error' });
  }
});

export { walletRouter };
