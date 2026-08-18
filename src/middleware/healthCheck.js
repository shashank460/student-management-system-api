import { isDatabaseHealthy } from '../config/database.js';

export function healthCheck(_req, res) {
  const databaseHealthy = isDatabaseHealthy();
  res.status(databaseHealthy ? 200 : 503).json({
    success: databaseHealthy,
    service: 'student-management-system-api',
    status: databaseHealthy ? 'healthy' : 'unhealthy',
    database: databaseHealthy ? 'connected' : 'disconnected'
  });
}
