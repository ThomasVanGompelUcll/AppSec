import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'defaultSecret';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET || 'defaultRefreshSecret';
const TOKEN_EXPIRATION = '15m'; // Short-lived token
const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token expiration

const tokenBlacklist = new Set<string>(); // In-memory blacklist (use a database for production)

export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const verifyToken = (token: string) => {
    if (tokenBlacklist.has(token)) {
        throw new Error('Token has been revoked');
    }
    return jwt.verify(token, SECRET_KEY);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET_KEY);
};

export const revokeToken = (token: string) => {
    tokenBlacklist.add(token);
};