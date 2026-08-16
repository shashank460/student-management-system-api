const API_KEY = process.env.API_KEY;

export function requireApiKey(req, res, next) {
  if (!API_KEY) {
    return res.status(503).json({ success: false, message: 'API authentication is not configured' });
  }

  const providedKey = req.get('x-api-key');
  if (!providedKey || providedKey !== API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid or missing API key' });
  }

  next();
}
