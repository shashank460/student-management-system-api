import app from './app.js';
import env from './config/env.js';
import { connectDatabase } from './config/database.js';
import mongoose from 'mongoose';
import logger from './config/logger.js';

let server;
let shuttingDown = false;

async function startServer() {
  try {
    await connectDatabase();
    server = app.listen(env.port, () => logger.info({ port: env.port }, 'API server started'));
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, 'Graceful shutdown started');

  const forceExit = setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  clearTimeout(forceExit);
  logger.info('Graceful shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
