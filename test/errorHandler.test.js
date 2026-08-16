import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import { notFound, errorHandler } from '../src/middleware/errorHandler.js';

function mockRes() {
  const res = {};
  res.status = mock.fn(() => res);
  res.json = mock.fn((payload) => { res.body = payload; return res; });
  return res;
}

describe('errorHandler middleware', () => {
  test('notFound responds with 404 and requested route', () => {
    const res = mockRes();
    notFound({ method: 'GET', originalUrl: '/api/v1/unknown' }, res);
    assert.equal(res.status.mock.calls[0].arguments[0], 404);
    assert.match(res.body.message, /GET \/api\/v1\/unknown/);
  });

  test('maps duplicate key errors to 409', () => {
    const res = mockRes();
    const consoleError = mock.method(console, 'error', () => {});
    errorHandler({ code: 11000, keyPattern: { email: 1 } }, {}, res, () => {});
    assert.equal(res.status.mock.calls[0].arguments[0], 409);
    assert.match(res.body.message, /email already exists/);
    consoleError.mock.restore();
  });

  test('maps validation errors to 400', () => {
    const res = mockRes();
    const consoleError = mock.method(console, 'error', () => {});
    errorHandler({ name: 'ValidationError', errors: { name: { message: 'Name is required' } } }, {}, res, () => {});
    assert.equal(res.status.mock.calls[0].arguments[0], 400);
    assert.deepEqual(res.body.errors, ['Name is required']);
    consoleError.mock.restore();
  });

  test('maps cast errors to 400', () => {
    const res = mockRes();
    const consoleError = mock.method(console, 'error', () => {});
    errorHandler({ name: 'CastError' }, {}, res, () => {});
    assert.equal(res.status.mock.calls[0].arguments[0], 400);
    assert.equal(res.body.message, 'Invalid resource ID');
    consoleError.mock.restore();
  });

  test('falls back to 500 for unknown errors', () => {
    const res = mockRes();
    const consoleError = mock.method(console, 'error', () => {});
    errorHandler(new Error('unexpected'), {}, res, () => {});
    assert.equal(res.status.mock.calls[0].arguments[0], 500);
    consoleError.mock.restore();
  });
});
