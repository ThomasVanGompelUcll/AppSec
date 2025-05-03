// src/routes/auth.router.ts
import express, { Request, Response } from 'express';
import { generateToken } from '../util/jwt';
import userService from '../service/user.service';

const authRouter = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user and receive a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user || user.password !== password) {
    // Note: In production, NEVER compare plaintext passwords
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return res.json({ token });
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

export { authRouter };