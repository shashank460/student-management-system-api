import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

const auth = { 'x-api-key': 'test-key' };

process.env.API_KEY = process.env.API_KEY || 'test-key';

test('GET /health reports database state', async () => {
  const res = await request(app).get('/health');
  assert.ok([200, 503].includes(res.status));
  assert.equal(typeof res.body.database, 'string');
});

test('GET /unknown returns 404 JSON', async () => {
  const res = await request(app).get('/unknown');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('API GET endpoints require an API key', async () => {
  const res = await request(app).get('/api/v1/students');
  assert.equal(res.status, 401);
  assert.equal(res.body.message, 'Missing or invalid API key');
});

test('API GET endpoint accepts a valid API key', async () => {
  const res = await request(app).get('/api/v1/students').set(auth);
  assert.ok([200, 500].includes(res.status));
  assert.equal(typeof res.body, 'object');
});

test('POST /students rejects requests without authentication', async () => {
  const res = await request(app).post('/api/v1/students').send({ name: 'Test Student' });
  assert.equal(res.status, 401);
});

test('POST /students reaches validation with a valid API key', async () => {
  const res = await request(app)
    .post('/api/v1/students')
    .set(auth)
    .send({ name: 'Test Student' });
  assert.ok([400, 500].includes(res.status));
  assert.equal(res.body.success, false);
});

test('PATCH /students/:id rejects invalid MongoDB id after authentication', async () => {
  const res = await request(app)
    .patch('/api/v1/students/not-an-object-id')
    .set(auth)
    .send({ name: 'Updated' });
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Invalid resource ID');
});

test('DELETE /students/:id rejects invalid MongoDB id after authentication', async () => {
  const res = await request(app)
    .delete('/api/v1/students/not-an-object-id')
    .set(auth);
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Invalid resource ID');
});
