import mongoose from 'mongoose';
import { app } from './app.js';
import { config } from './config.js';
import { ensureInitialAdmin } from './services/auth.js';
import { ensureSeedArticles } from './services/seed.js';

const start = async (): Promise<void> => {
  await mongoose.connect(config.mongodbUri);
  await ensureInitialAdmin();
  await ensureSeedArticles();
  const server = app.listen(config.port, () => {
    console.log(`Backend listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
};

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exitCode = 1;
});
