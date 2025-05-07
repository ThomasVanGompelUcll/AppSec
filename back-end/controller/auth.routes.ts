// src/routes/auth.router.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken, verifyRefreshToken, revokeToken } from '../util/jwt';
import userService from '../service/user.service';
import { z } from 'zod';

const authRouter = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phoneNumber: z.string().min(10),
  personalNumber: z.number(),
  role: z.enum(['admin', 'owner', 'user']),
});

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
 *                 refreshToken:
 *                   type: string
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
  }

  const { email, password } = parsed.data;

  try {
    const user = await userService.findByEmail(email); // Safe query with validated input

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return res.json({ token, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
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
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    const user = await userService.createUser({
      ...parsed.data,
      password: hashedPassword,
      age: 0, // Ensure all required fields are provided
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh the JWT token using a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New JWT token and refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */
authRouter.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    revokeToken(refreshToken);

    if (typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const newToken = generateToken({ id: decoded.id, role: decoded.role });
    const newRefreshToken = generateRefreshToken({ id: decoded.id });

    return res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

authRouter.post('/safe-login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
  }

  const { email, password } = parsed.data;

  try {
    const user = await userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return res.json({ token, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export { authRouter };