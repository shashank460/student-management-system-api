import express from 'express';
import app from './app.js';
import env from './config/env.js';
import { connectDatabase, isDatabaseHealthy } from './config/database.js';

const serverApp = express();

serverApp.get('/health', (_req, res) => {
  const databaseHealthy = isDatabaseHealthy();
  res.status(databaseHealthy ? 200 : 503).json({
    success: databaseHealthy,
    service: 'student-management-system-api',
    status: databaseHealthy ? 'healthy' : 'unhealthy',
    database: databaseHealthy ? 'connected' : 'disconnected'
  });
});

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
