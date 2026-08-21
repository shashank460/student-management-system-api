import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import env from '../src/config/env.js';

const teacherToken = jwt.sign({ sub: '507f1f77bcf86cd799439011', role: 'teacher', email: 'teacher@example.com' }, env.jwtSecret);

test('GET /health returns database-aware status', async () => {
  const res = await request(app).get('/health');
  assert.ok([200, 503].includes(res.status));
  assert.equal(typeof res.body.database, 'string');
  assert.ok(res.headers['x-request-id']);
});

test('GET /api-docs.json serves OpenAPI documentation', async () => {
  const res = await request(app).get('/api-docs.json');
  assert.equal(res.status, 200);
  assert.equal(res.body.openapi, '3.0.3');
  assert.ok(res.body.paths['/api/v1/auth/login']);
});

test('GET /api-docs serves Swagger UI', async () => {
  const res = await request(app).get('/api-docs/');
  assert.equal(res.status, 200);
  assert.match(res.text, /swagger/i);
});

test('GET /unknown returns 404 JSON', async () => {
  const res = await request(app).get('/unknown');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('POST /students rejects requests without JWT authentication', async () => {
  const res = await request(app).post('/api/v1/students').send({ name: 'Test Student' });
  assert.equal(res.status, 401);
});

test('POST /students reaches strict Zod validation with a valid JWT', async () => {
  const res = await request(app)
    .post('/api/v1/students')
    .set('Authorization', `Bearer ${teacherToken}`)
    .send({ name: 'Test Student', unexpected: true });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, 'Request validation failed');
});

test('GET students rejects unknown query parameters', async () => {
  const res = await request(app).get('/api/v1/students?unknown=value');
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Request validation failed');
});

test('DELETE student requires an admin JWT', async () => {
  const res = await request(app)
    .delete('/api/v1/students/507f1f77bcf86cd799439011')
    .set('Authorization', `Bearer ${teacherToken}`);
  assert.equal(res.status, 403);
});
