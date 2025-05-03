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

const userRouter = express.Router();

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

/**
 * @swagger
 * /users:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Create a new user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *         200:
 *            description: The created user.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const result = await userService.createUser(user);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { userRouter };