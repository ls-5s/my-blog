import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const asPositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const durationToMs = (value: string): number => {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) throw new Error('JWT_EXPIRES_IN must use a duration such as 30m, 12h, or 7d');
  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier = unit === 's' ? 1_000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;
  return amount * multiplier;
};

const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

export const config = {
  port: asPositiveInt(process.env.PORT, 4000),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/vue-blog-admin',
  jwtSecret: process.env.JWT_SECRET ?? 'development-only-change-this-secret',
  jwtExpiresIn,
  authCookieMaxAgeMs: durationToMs(jwtExpiresIn),
  adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.ADMIN_PASSWORD,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  authCookieName: 'blog_admin_token',
} as const;

if (config.isProduction && config.jwtSecret === 'development-only-change-this-secret') {
  throw new Error('JWT_SECRET must be configured in production');
}
