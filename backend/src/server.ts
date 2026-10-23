import { app, initializeApplication } from './app.js';
import { config } from './config.js';
import { closeDatabase } from './services/database.turso.js';

const start = async (): Promise<void> => {
  await initializeApplication();
  const server = app.listen(config.port, () => {
    console.log(`Backend listening on http://localhost:${config.port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await closeDatabase();
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
