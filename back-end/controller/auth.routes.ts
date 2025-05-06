// src/routes/auth.router.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken, verifyRefreshToken, revokeToken } from '../util/jwt';
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
 *                 refreshToken:
 *                   type: string
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, role: user.role }); // Avoid including sensitive data like email
  const refreshToken = generateRefreshToken({ id: user.id });

  return res.json({ token, refreshToken });
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
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userService.createUser({ ...req.body, password: hashedPassword });
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

export { authRouter };