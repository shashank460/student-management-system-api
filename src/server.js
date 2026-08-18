import express from 'express';
import app from './app.js';
import env from './config/env.js';
import { connectDatabase } from './config/database.js';
import { healthCheck } from './middleware/healthCheck.js';

const serverApp = express();
serverApp.get('/health', healthCheck);
serverApp.use(app);

async function startServer() {
  try {
    await connectDatabase();
    serverApp.listen(env.port, () => console.log(`API listening on port ${env.port}`));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
