import logger from '../config/logger.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, code: 'ROUTE_NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` });
}

export function errorHandler(err, req, res, _next) {
  logger.error({ err, requestId: req.id }, 'Unhandled request error');
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ success: false, code: 'RESOURCE_CONFLICT', message: `${field} already exists` });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, code: 'DATABASE_VALIDATION_ERROR', message: 'Validation failed', errors: Object.values(err.errors).map(e => e.message) });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, code: 'INVALID_RESOURCE_ID', message: 'Invalid resource ID' });
  }
  res.status(500).json({ success: false, code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
}
