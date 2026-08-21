import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function authenticate(req, res, next) {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }

  try {
    req.user = jwt.verify(header.slice(7), env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    return next();
  };
}
