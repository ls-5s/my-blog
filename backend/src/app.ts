import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { publicRouter } from './routes/public.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler, notFound } from './middleware/error.js';
import { ensureInitialAdmin } from './services/auth.js';
import { ensureSeedArticles } from './services/seed.js';
import { initializeDatabase } from './services/database.turso.js';

export const app = express();
let initialization: Promise<void> | undefined;

export const initializeApplication = (): Promise<void> => {
  if (!initialization) {
    const pending = (async () => {
      await initializeDatabase();
      await ensureInitialAdmin();
      await ensureSeedArticles();
    })();
    initialization = pending.catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
};

app.disable('x-powered-by');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === config.frontendOrigin) {
      callback(null, origin ?? config.frontendOrigin);
      return;
    }

    if (!config.isProduction) {
      try {
        const url = new URL(origin);
        const isLocalFrontend = url.protocol === 'http:'
          && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
        callback(null, isLocalFrontend ? origin : false);
        return;
      } catch {
        callback(null, false);
        return;
      }
    }

    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use(notFound);
app.use(errorHandler);

export default async function handler(request: Request, response: Response): Promise<void> {
  try {
    await initializeApplication();
  } catch (error) {
    console.error('Application initialization failed', error);
    if (!response.headersSent) {
      response.status(503).json({
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: '服务暂时不可用，请稍后重试',
        },
      });
    }
    return;
  }
  app(request, response);
}
