import env from '../config/env.js';

/**
 * Guards mutating requests behind a shared API key.
 * Read endpoints remain open; this is intentionally lightweight for a portfolio/internal API.
 */
export function requireApiKey(req, res, next) {
  const isMutating = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
  if (!isMutating) return next();

  if (!env.apiKey) return next();

  const providedKey = req.get('x-api-key');
  if (!providedKey || providedKey !== env.apiKey) {
    return res.status(401).json({ success: false, message: 'Missing or invalid API key' });
  }

  return next();
}
