import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import type { Response } from 'express';
import { config } from '../config.js';
import { findAdmin, insertAdmin, removeOtherAdmins } from './database.turso.js';

export type AuthenticatedAdmin = {
  id: string;
  username: string;
  role: 'admin';
};

type TokenPayload = JwtPayload & AuthenticatedAdmin;

const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'none' as const : 'lax' as const,
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
  const admin = await findAdmin(username);
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) return null;
  return { id: admin.id, username: admin.username, role: 'admin' };
};

export const ensureInitialAdmin = async (): Promise<void> => {
  if (!config.adminPassword) {
    console.warn('ADMIN_PASSWORD is not configured; skipping initial admin creation.');
    return;
  }
  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await removeOtherAdmins(config.adminUsername);
  await insertAdmin({ id: `admin-${config.adminUsername}`, username: config.adminUsername, passwordHash });
  console.log(`Synchronized configured admin account: ${config.adminUsername}`);
};
