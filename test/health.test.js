import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('health and routing', () => {
  test('GET /health reports database-aware status', async () => {
    const res = await request(app).get('/health');
    assert.ok([200, 503].includes(res.status));
    assert.equal(typeof res.body.database, 'string');
    assert.equal(typeof res.body.status, 'string');
  });

  test('GET unknown route returns 404 JSON', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });
});
