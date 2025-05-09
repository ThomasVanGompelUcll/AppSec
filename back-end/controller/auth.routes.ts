import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken, revokeToken, verifyToken } from '../util/jwt';
import userService from '../service/user.service';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { getSecret } from '../util/awsSecrets';

export const TOKEN_EXPIRATION = 60 *1000;
export const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 *1000;

const authRouter = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[@$!%*?&#]/, 'Must contain at least one special character'),
  phoneNumber: z.string().min(10),
  personalNumber: z.number(),
  role: z.enum(['admin', 'owner', 'user']),
});

const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Too many requests, please try again later.' },
});

authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
  }

  try {
    const plainPassword = parsed.data.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const { firstName, lastName, email, phoneNumber, personalNumber, role } = parsed.data;

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      personalNumber,
      role,
      password: hashedPassword,
      age: 0,
    });

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

authRouter.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
  }

  const { email, password } = parsed.data;

  try {
    const user = await userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password || ''))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRATION,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRATION,
    });



    return res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

authRouter.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("refreshing token ------------------------", refreshToken)
  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const secretKey = await getSecret('JWT_SECRET');
    console.log("jfkldssssssssssssssssssss", secretKey)
    if (!secretKey) throw new Error("Secret key is undefined.");

    const secretBundle = await getSecret('JWT_SECRET'); 

    if (!secretBundle) {
      throw new Error("Secret bundle is undefined.");
    }
    const secrets = JSON.parse(secretBundle);
    const refreshSecret = secrets.JWT_REFRESH_SECRET;

    if (!refreshSecret) throw new Error("Refresh secret is undefined.");

    const decoded = await verifyToken(refreshToken, refreshSecret);
    console.log("+++++++++++++++++++++++++++", decoded)
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }
    
    console.log("==============", decoded)

    await revokeToken(refreshToken);

    const newToken = await generateToken({ id: decoded.id, role: decoded.role });
    const newRefreshToken = await generateRefreshToken({ id: decoded.id });

    res.cookie('accessToken', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRATION // 15 minutes
  });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRATION,
    });
    console.log('new tokens:', newToken, newRefreshToken)
    return res.sendStatus(200);
  } catch (error) {
    console.error('Refresh error:', error);
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

    if (!user || !(await bcrypt.compare(password, user.password || ''))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRATION,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRATION,
    });

    return res.json({ message: 'Safe login successful' });
  } catch (error) {
    console.error('Safe login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export { authRouter };
