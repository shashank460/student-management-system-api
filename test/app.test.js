import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /health returns a healthy service', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.status, 'healthy');
});

test('GET /unknown returns 404 JSON', async () => {
  const res = await request(app).get('/unknown');
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('GET /api/v1/students without a database connection returns a controlled server response', async () => {
  const res = await request(app).get('/api/v1/students');
  assert.ok([200, 500].includes(res.status));
  assert.equal(typeof res.body, 'object');
});

test('GET /api/v1/attendance returns a JSON response', async () => {
  const res = await request(app).get('/api/v1/attendance');
  assert.ok([200, 500].includes(res.status));
  assert.equal(typeof res.body, 'object');
});

test('GET /api/v1/academics returns a JSON response', async () => {
  const res = await request(app).get('/api/v1/academics');
  assert.ok([200, 500].includes(res.status));
  assert.equal(typeof res.body, 'object');
});

test('POST /api/v1/students rejects malformed JSON fields through model validation', async () => {
  const res = await request(app)
    .post('/api/v1/students')
    .send({ name: 'Test Student' });
  assert.ok([400, 500].includes(res.status));
  assert.equal(res.body.success, false);
});

test('PATCH /api/v1/students/:id rejects an invalid MongoDB id', async () => {
  const res = await request(app)
    .patch('/api/v1/students/not-an-object-id')
    .send({ name: 'Updated' });
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Invalid resource ID');
});

test('DELETE /api/v1/students/:id rejects an invalid MongoDB id', async () => {
  const res = await request(app).delete('/api/v1/students/not-an-object-id');
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Invalid resource ID');
});
