import { test, describe, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import env from '../src/config/env.js';
import { requireApiKey } from '../src/middleware/apiKeyAuth.js';

describe('requireApiKey middleware', () => {
  const originalKey = env.apiKey;

  afterEach(() => { env.apiKey = originalKey; });

  test('allows GET requests without a key', () => {
    env.apiKey = 'secret123';
    const req = { method: 'GET', get: () => undefined };
    const res = { status: mock.fn(() => res), json: mock.fn() };
    const next = mock.fn();
    requireApiKey(req, res, next);
    assert.equal(next.mock.calls.length, 1);
    assert.equal(res.status.mock.calls.length, 0);
  });

  test('blocks POST requests missing the key', () => {
    env.apiKey = 'secret123';
    const req = { method: 'POST', get: () => undefined };
    const res = { status: mock.fn(() => res), json: mock.fn() };
    const next = mock.fn();
    requireApiKey(req, res, next);
    assert.equal(res.status.mock.calls[0].arguments[0], 401);
    assert.equal(next.mock.calls.length, 0);
  });

  test('blocks POST requests with the wrong key', () => {
    env.apiKey = 'secret123';
    const req = { method: 'POST', get: () => 'wrong-key' };
    const res = { status: mock.fn(() => res), json: mock.fn() };
    const next = mock.fn();
    requireApiKey(req, res, next);
    assert.equal(res.status.mock.calls[0].arguments[0], 401);
  });

  test('allows POST requests with the correct key', () => {
    env.apiKey = 'secret123';
    const req = { method: 'POST', get: () => 'secret123' };
    const res = { status: mock.fn(() => res), json: mock.fn() };
    const next = mock.fn();
    requireApiKey(req, res, next);
    assert.equal(next.mock.calls.length, 1);
  });

  test('skips enforcement when no API key is configured', () => {
    env.apiKey = '';
    const req = { method: 'DELETE', get: () => undefined };
    const res = { status: mock.fn(() => res), json: mock.fn() };
    const next = mock.fn();
    requireApiKey(req, res, next);
    assert.equal(next.mock.calls.length, 1);
  });
});
