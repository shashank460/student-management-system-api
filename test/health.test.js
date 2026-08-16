import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('health and routing', () => {
  test('GET /health returns 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.status, 'healthy');
  });

  test('GET unknown route returns 404 JSON', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  test('GET student collection remains public when API key is configured', async () => {
    const res = await request(app).get('/api/v1/students');
    assert.notEqual(res.status, 401);
  });
});
