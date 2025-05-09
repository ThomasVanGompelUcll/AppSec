// src/util/jwt.ts
import jwt from 'jsonwebtoken';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import * as dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_DEFAULT_REGION || 'eu-central-1';
const client = new SecretsManagerClient({ region });

let secretsLoaded = false;
const tokenBlacklist = new Set<string>();

export const TOKEN_EXPIRATION = '1m';
export const REFRESH_TOKEN_EXPIRATION = '7d';

/**
 * Fetch and cache secrets from AWS Secrets Manager.
 */
export async function ensureSecrets() {
  if (secretsLoaded) return;

  const secretName = process.env.JWT_SECRET_NAME || 'JWT_SECRET';

  if (!/^[a-zA-Z0-9-/_+=.@!]+$/.test(secretName)) {
    throw new Error('Invalid secret name. Must contain only alphanumeric characters or -/_+=.@!');
  }

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);

    if (!data.SecretString) throw new Error('SecretString is empty');

    const parsed = JSON.parse(data.SecretString);
    process.env.JWT_SECRET = parsed.JWT_SECRET;
    process.env.JWT_REFRESH_SECRET = parsed.JWT_REFRESH_SECRET;

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('Missing expected keys in secret');
    }

    secretsLoaded = true;
  } catch (error) {
    console.error('Failed to retrieve secret:', (error as Error).message);
    throw error;
  }
}

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET || 'defaultSecret';
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: object): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret';
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

export const verifyToken = async (token: string, secretKey: string): Promise<any> => {
  console.log("verifying token:", token, "with secret: ", secretKey)
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return reject(new Error('Token has expired'));
        }
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const blacklistToken = (token: string): void => {
  tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};

export const revokeToken = (token: string): void => {
  tokenBlacklist.add(token);
};
