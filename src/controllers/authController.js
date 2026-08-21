import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, message: 'Email is already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: 'teacher' });
  const token = signToken(user);

  res.status(201).json({
    success: true,
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({
    success: true,
    data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }
  });
}
