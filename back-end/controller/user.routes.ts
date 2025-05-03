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
import { UserInput } from '../types'
import jwt from 'jsonwebtoken';
import { User } from '../model/user'; // Adjust according to your model
import dotenv from 'dotenv';

dotenv.config();

const userRouter = express.Router();

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in .env');
}

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
    // Get token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    console.log("heeee")
    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey) as { id: number }; // Using the secretKey from .env

        // Retrieve the user based on the decoded ID
        const user = await userService.getUserById(decoded.id); // Adjust according to your model and database query

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user's details
        res.json(user);
    } catch (error) {
        console.error(error);
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
        const user = await userService.getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ status: 'error' });
    }
});

export { userRouter };