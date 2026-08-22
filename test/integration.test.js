import test, { before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcryptjs';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/student_management_test';
process.env.JWT_SECRET ||= 'test-only-jwt-secret-change-me-please-123456';

const { default: app } = await import('../src/app.js');
const { connectDatabase } = await import('../src/config/database.js');
const { default: User } = await import('../src/models/User.js');
const { default: Student } = await import('../src/models/Student.js');
const { default: Attendance } = await import('../src/models/Attendance.js');
const { default: AcademicRecord } = await import('../src/models/AcademicRecord.js');

let teacherToken;
let adminToken;

async function login(email, password) {
  const response = await request(app).post('/api/v1/auth/login').send({ email, password });
  assert.equal(response.status, 200);
  return response.body.data.token;
}

before(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Attendance.deleteMany({}),
    AcademicRecord.deleteMany({})
  ]);

  await User.create({
    name: 'Teacher User',
    email: 'teacher@test.local',
    passwordHash: await bcrypt.hash('TeacherPassword123!', 10),
    role: 'teacher'
  });
  await User.create({
    name: 'Admin User',
    email: 'admin@test.local',
    passwordHash: await bcrypt.hash('AdminPassword123!', 10),
    role: 'admin'
  });

  teacherToken = await login('teacher@test.local', 'TeacherPassword123!');
  adminToken = await login('admin@test.local', 'AdminPassword123!');
});

test('registers and authenticates a user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({ name: 'New Teacher', email: 'new@test.local', password: 'Password123!' });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.user.role, 'teacher');
  assert.ok(response.body.data.token);
});

test('creates a student with a valid teacher JWT', async () => {
  const response = await request(app)
    .post('/api/v1/students')
    .set('Authorization', `Bearer ${teacherToken}`)
    .send({
      studentId: 'TEST-001',
      name: 'Test Student',
      email: 'student@test.local',
      department: 'CSE',
      semester: 6,
      phone: '9876543210',
      enrollmentYear: 2023
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.studentId, 'TEST-001');
});

test('rejects student creation without authentication', async () => {
  const response = await request(app).post('/api/v1/students').send({
    studentId: 'TEST-002', name: 'Unauthenticated', email: 'no@test.local', department: 'CSE', semester: 6, enrollmentYear: 2023
  });
  assert.equal(response.status, 401);
});

test('prevents a teacher from deleting a student', async () => {
  const student = await Student.create({
    studentId: 'TEST-003', name: 'Protected Student', email: 'protected@test.local', department: 'CSE', semester: 6, enrollmentYear: 2023
  });
  const response = await request(app)
    .delete(`/api/v1/students/${student._id}`)
    .set('Authorization', `Bearer ${teacherToken}`);
  assert.equal(response.status, 403);
});

test('computes academic grades and SGPA server-side', async () => {
  const student = await Student.create({
    studentId: 'TEST-004', name: 'Academic Student', email: 'academic@test.local', department: 'CSE', semester: 6, enrollmentYear: 2023
  });
  const response = await request(app)
    .post('/api/v1/academics')
    .set('Authorization', `Bearer ${teacherToken}`)
    .send({
      student: student._id.toString(),
      semester: 6,
      subjects: [{ name: 'DSA', marks: 92 }, { name: 'DBMS', marks: 78 }],
      sgpa: 0
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.subjects[0].grade, 'A+');
  assert.equal(response.body.data.subjects[1].grade, 'B+');
  assert.equal(response.body.data.sgpa, 8.5);
});

test('normalizes attendance to one record per UTC calendar day', async () => {
  const student = await Student.create({
    studentId: 'TEST-005', name: 'Attendance Student', email: 'attendance@test.local', department: 'CSE', semester: 6, enrollmentYear: 2023
  });
  const first = await request(app)
    .post('/api/v1/attendance')
    .set('Authorization', `Bearer ${teacherToken}`)
    .send({ student: student._id.toString(), date: '2026-08-22T09:00:00Z', status: 'present' });
  const second = await request(app)
    .post('/api/v1/attendance')
    .set('Authorization', `Bearer ${teacherToken}`)
    .send({ student: student._id.toString(), date: '2026-08-22T16:00:00Z', status: 'absent' });

  assert.equal(first.status, 201);
  assert.equal(second.status, 409);
});

test('admin deletion cascades attendance and academic records', async () => {
  const student = await Student.create({
    studentId: 'TEST-006', name: 'Cascade Student', email: 'cascade@test.local', department: 'CSE', semester: 6, enrollmentYear: 2023
  });
  await Attendance.create({ student: student._id, date: '2026-08-22', status: 'present' });
  await AcademicRecord.create({ student: student._id, semester: 6, subjects: [{ name: 'OS', marks: 88 }] });

  const response = await request(app)
    .delete(`/api/v1/students/${student._id}`)
    .set('Authorization', `Bearer ${adminToken}`);

  assert.equal(response.status, 204);
  assert.equal(await Attendance.countDocuments({ student: student._id }), 0);
  assert.equal(await AcademicRecord.countDocuments({ student: student._id }), 0);
});

after(async () => {
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Attendance.deleteMany({}),
    AcademicRecord.deleteMany({})
  ]);
  const mongoose = (await import('mongoose')).default;
  await mongoose.disconnect();
});
