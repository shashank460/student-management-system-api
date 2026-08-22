import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import env from '../src/config/env.js';
import User from '../src/models/User.js';
import Student from '../src/models/Student.js';

let mongo;
let teacherToken;
let studentToken;

before(async () => {
  mongo = await MongoMemoryServer.create();
  env.mongoUri = mongo.getUri('student_management_test');
  await mongoose.connect(env.mongoUri);

  const teacher = await request(app).post('/api/v1/auth/register').send({ name: 'Integration Teacher', email: 'teacher@example.com', password: 'Password123!' });
  assert.equal(teacher.status, 201);
  teacherToken = teacher.body.data.accessToken;

  const student = await request(app).post('/api/v1/auth/register').send({ name: 'Integration Student', email: 'student@example.com', password: 'Password123!', role: 'student' });
  assert.equal(student.status, 201);
  studentToken = student.body.data.accessToken;
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongo.stop();
});

test('register hashes password and returns access + refresh tokens', async () => {
  const res = await request(app).post('/api/v1/auth/register').send({ name: 'New Teacher', email: 'new@example.com', password: 'Password123!' });
  assert.equal(res.status, 201);
  assert.ok(res.body.data.accessToken);
  assert.ok(res.body.data.refreshToken);
  const user = await User.findOne({ email: 'new@example.com' }).select('+passwordHash');
  assert.ok(user.passwordHash);
  assert.notEqual(user.passwordHash, 'Password123!');
});

test('login rejects invalid credentials with a stable error code', async () => {
  const res = await request(app).post('/api/v1/auth/login').send({ email: 'teacher@example.com', password: 'wrong-password' });
  assert.equal(res.status, 401);
  assert.equal(res.body.code, 'AUTH_INVALID_CREDENTIALS');
});

test('refresh rotates refresh token and rejects replay', async () => {
  const login = await request(app).post('/api/v1/auth/login').send({ email: 'teacher@example.com', password: 'Password123!' });
  const oldRefresh = login.body.data.refreshToken;
  const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: oldRefresh });
  assert.equal(res.status, 200);
  assert.ok(res.body.data.accessToken);
  assert.notEqual(res.body.data.refreshToken, oldRefresh);
  const replay = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: oldRefresh });
  assert.equal(replay.status, 401);
  assert.equal(replay.body.code, 'AUTH_REFRESH_REVOKED');
});

test('GET /health returns database-aware status and request ID', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.database, 'connected');
  assert.ok(res.headers['x-request-id']);
});

test('Swagger JSON and UI are available', async () => {
  const json = await request(app).get('/api-docs.json');
  assert.equal(json.status, 200);
  assert.equal(json.body.openapi, '3.0.3');
  assert.ok(json.body.paths['/api/v1/auth/login']);
  const ui = await request(app).get('/api-docs/');
  assert.equal(ui.status, 200);
  assert.match(ui.text, /swagger/i);
});

test('unknown route returns a stable error code', async () => {
  const res = await request(app).get('/unknown');
  assert.equal(res.status, 404);
  assert.equal(res.body.code, 'ROUTE_NOT_FOUND');
});

test('student creation requires JWT authentication', async () => {
  const res = await request(app).post('/api/v1/students').send({ name: 'Test Student' });
  assert.equal(res.status, 401);
  assert.equal(res.body.code, 'AUTH_TOKEN_REQUIRED');
});

test('strict Zod validation rejects unknown fields with structured errors', async () => {
  const res = await request(app).post('/api/v1/students').set('Authorization', `Bearer ${teacherToken}`).send({ name: 'Test Student', unexpected: true });
  assert.equal(res.status, 400);
  assert.equal(res.body.code, 'VALIDATION_ERROR');
  assert.ok(Array.isArray(res.body.errors));
  assert.equal(res.body.errors[0].source, 'body');
});

test('unknown query parameters are rejected', async () => {
  const res = await request(app).get('/api/v1/students?unknown=value').set('Authorization', `Bearer ${studentToken}`);
  assert.equal(res.status, 400);
  assert.equal(res.body.code, 'VALIDATION_ERROR');
});

test('admin-only delete rejects a teacher', async () => {
  const student = await Student.create({ studentId: 'TEST-001', name: 'Delete Target', email: 'delete@example.com', department: 'CSE', semester: 6, enrollmentYear: 2023 });
  const res = await request(app).delete(`/api/v1/students/${student._id}`).set('Authorization', `Bearer ${teacherToken}`);
  assert.equal(res.status, 403);
  assert.equal(res.body.code, 'AUTH_FORBIDDEN');
});

test('student role cannot create attendance', async () => {
  const res = await request(app).post('/api/v1/attendance').set('Authorization', `Bearer ${studentToken}`).send({ student: '507f1f77bcf86cd799439011', date: '2026-01-01', status: 'present' });
  assert.equal(res.status, 403);
  assert.equal(res.body.code, 'AUTH_FORBIDDEN');
});
