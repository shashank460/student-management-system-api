import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../src/middleware/auth.js';
import env from '../src/config/env.js';

test('authenticate rejects missing bearer token', () => {
  const req = { get: () => undefined };
  let status;
  let body;
  const res = { status(code) { status = code; return this; }, json(value) { body = value; } };
  authenticate(req, res, () => {});
  assert.equal(status, 401);
  assert.equal(body.success, false);
});

test('authenticate accepts a valid JWT and exposes user claims', () => {
  const token = jwt.sign({ sub: '507f1f77bcf86cd799439011', role: 'teacher', email: 'teacher@example.com' }, env.jwtSecret);
  const req = { get: (name) => name === 'authorization' ? `Bearer ${token}` : undefined };
  const res = { status() { return this; }, json() {} };
  let called = false;
  authenticate(req, res, () => { called = true; });
  assert.equal(called, true);
  assert.equal(req.user.role, 'teacher');
});

test('authorize rejects teachers from admin-only actions', () => {
  const req = { user: { role: 'teacher' } };
  let status;
  const res = { status(code) { status = code; return this; }, json() {} };
  authorize('admin')(req, res, () => {});
  assert.equal(status, 403);
});

test('authorize allows admins', () => {
  const req = { user: { role: 'admin' } };
  let called = false;
  authorize('admin')(req, {}, () => { called = true; });
  assert.equal(called, true);
});
