import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import type { Response } from 'express';
import { Admin } from '../models/Admin.js';
import { config } from '../config.js';

export type AuthenticatedAdmin = {
  id: string;
  username: string;
  role: 'admin';
};

type TokenPayload = JwtPayload & AuthenticatedAdmin;

const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: config.authCookieMaxAgeMs,
};

export const signAdminToken = (admin: AuthenticatedAdmin): string => {
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(admin, config.jwtSecret, options);
};

export const setAuthCookie = (response: Response, admin: AuthenticatedAdmin): void => {
  response.cookie(config.authCookieName, signAdminToken(admin), cookieOptions);
};

export const clearAuthCookie = (response: Response): void => {
  response.clearCookie(config.authCookieName, { ...cookieOptions, maxAge: undefined });
};

export const verifyAdminToken = (token: string): AuthenticatedAdmin | null => {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    if (payload.role !== 'admin' || !payload.id || !payload.username) return null;
    return { id: payload.id, username: payload.username, role: 'admin' };
  } catch {
    return null;
  }
};

export const authenticateAdmin = async (
  username: string,
  password: string,
): Promise<AuthenticatedAdmin | null> => {
  const admin = await Admin.findOne({ username }).lean();
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) return null;
  return { id: String(admin._id), username: admin.username, role: 'admin' };
};

export const ensureInitialAdmin = async (): Promise<void> => {
  if (!config.adminPassword) {
    console.warn('ADMIN_PASSWORD is not configured; skipping initial admin creation.');
    return;
  }
  const existing = await Admin.findOne({ username: config.adminUsername });
  if (existing) return;
  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await Admin.create({ username: config.adminUsername, passwordHash, role: 'admin' });
  console.log(`Created initial admin account: ${config.adminUsername}`);
};
