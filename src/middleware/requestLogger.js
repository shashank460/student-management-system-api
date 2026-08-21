import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import logger from '../config/logger.js';

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const requestId = req.get('x-request-id') || randomUUID();
    res.setHeader('x-request-id', requestId);
    return requestId;
  },
  customProps: (req) => ({ correlationId: req.id }),
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
});
