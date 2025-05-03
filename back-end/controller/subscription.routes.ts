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

const subscriptionRouter = express.Router();

  
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
        res.status(400).json({ status: 'error' });    }
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
  subscriptionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = <SubscriptionInput>req.body;
        const result = await subscriptionService.createSubscription({ ...subscription });
        res.status(200).json(result);
    } catch (error) {
        console.log('----------------------------------', error)
        res.status(400).json({ status: 'error' });    }
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
  
      await subscriptionService.deleteSubscription(Number(subscriptionId), userId);
  
      res.status(204).send();
    } catch (error) {
        res.status(400).json({ status: 'error' });    }
});
export { subscriptionRouter };