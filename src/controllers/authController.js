import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import env from '../config/env.js';

const refreshLifetimeMs = 7 * 24 * 60 * 60 * 1000;

function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueRefreshToken(user) {
  const token = jwt.sign({ sub: user._id.toString(), type: 'refresh' }, env.refreshTokenSecret, { expiresIn: env.refreshTokenExpiresIn });
  await RefreshToken.create({ user: user._id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + refreshLifetimeMs) });
  return token;
}

function userView(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId };
}

export async function register(req, res) {
  const { name, email, password, role = 'teacher', studentId = null } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, code: 'AUTH_EMAIL_EXISTS', message: 'Email is already registered' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role, studentId });
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user);
  res.status(201).json({ success: true, data: { user: userView(user), accessToken, refreshToken } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid email or password' });
  }
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user);
  res.json({ success: true, data: { user: userView(user), accessToken, refreshToken } });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.refreshTokenSecret);
  } catch {
    return res.status(401).json({ success: false, code: 'AUTH_REFRESH_INVALID', message: 'Invalid or expired refresh token' });
  }
  if (payload.type !== 'refresh') return res.status(401).json({ success: false, code: 'AUTH_REFRESH_INVALID', message: 'Invalid refresh token' });

  const stored = await RefreshToken.findOne({ user: payload.sub, tokenHash: hashToken(refreshToken) });
  if (!stored) return res.status(401).json({ success: false, code: 'AUTH_REFRESH_REVOKED', message: 'Refresh token is revoked or already rotated' });

  await RefreshToken.deleteOne({ _id: stored._id });
  const user = await User.findById(payload.sub);
  if (!user) return res.status(401).json({ success: false, code: 'AUTH_USER_NOT_FOUND', message: 'User no longer exists' });
  const accessToken = signAccessToken(user);
  const rotatedRefreshToken = await issueRefreshToken(user);
  res.json({ success: true, data: { accessToken, refreshToken: rotatedRefreshToken } });
}

export async function logout(req, res) {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
  res.json({ success: true, code: 'AUTH_LOGOUT_SUCCESS', message: 'Logged out successfully' });
}
