import type { AuthenticatedAdmin } from '../services/auth.js';

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export {};
