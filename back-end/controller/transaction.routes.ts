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

const transactionRouter = express.Router();

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
  transactionRouter.get('/', async (req: Request, res: Response) => {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ status: 'error' });    }
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
transactionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = <TransactionInput>req.body;
      const result = await transactionService.createTransaction(transaction);
      res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ status: 'error' });    }
  });
  
export { transactionRouter };