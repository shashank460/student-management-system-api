import env from '../config/env.js';

/**
 * Protects every API route with a shared API key.
 * Health remains public for deployment monitoring.
 */
export function requireApiKey(req, res, next) {
  const providedKey = req.get('x-api-key');

  if (!env.apiKey || !providedKey || providedKey !== env.apiKey) {
    return res.status(401).json({ success: false, message: 'Missing or invalid API key' });
  }

  return next();
}
