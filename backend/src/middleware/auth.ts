import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';
import { verifyAdminToken } from '../services/auth.js';
import { AppError } from './error.js';

export const requireAdmin = (request: Request, _response: Response, next: NextFunction): void => {
  const token = request.cookies?.[config.authCookieName] as string | undefined;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) return next(new AppError(401, 'UNAUTHENTICATED', '管理员登录已失效，请重新登录'));
  request.admin = admin;
  next();
};
