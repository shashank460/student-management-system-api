import { test, describe, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import Student from '../src/models/Student.js';
import Attendance from '../src/models/Attendance.js';
import AcademicRecord from '../src/models/AcademicRecord.js';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from '../src/controllers/studentController.js';

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = mock.fn((code) => { res.statusCode = code; return res; });
  res.json = mock.fn((payload) => { res.body = payload; return res; });
  res.send = mock.fn(() => res);
  return res;
}

describe('studentController', () => {
  afterEach(() => mock.restoreAll());

  test('createStudent returns 201 with created student', async () => {
    const fakeStudent = { _id: '1', studentId: 'REC-CSE-001', name: 'Aarav Sharma' };
    mock.method(Student, 'create', async () => fakeStudent);
    const res = mockRes();
    await createStudent({ body: { studentId: 'REC-CSE-001', name: 'Aarav Sharma' } }, res);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, { success: true, data: fakeStudent });
  });

  test('getStudents applies filters and pagination', async () => {
    const fakeStudents = [{ _id: '1' }, { _id: '2' }];
    const limit = mock.fn(async () => fakeStudents);
    const skip = mock.fn(() => ({ limit }));
    const sort = mock.fn(() => ({ skip }));
    mock.method(Student, 'find', () => ({ sort }));
    mock.method(Student, 'countDocuments', async () => 5);
    const res = mockRes();
    await getStudents({ query: { department: 'CSE', semester: '4', page: '2', limit: '2' } }, res);
    assert.deepEqual(Student.find.mock.calls[0].arguments[0], { department: 'CSE', semester: 4 });
    assert.equal(skip.mock.calls[0].arguments[0], 2);
    assert.equal(res.body.total, 5);
    assert.equal(res.body.page, 2);
    assert.equal(res.body.totalPages, 3);
  });

  test('getStudents caps page size at 100', async () => {
    const limit = mock.fn(async () => []);
    const skip = mock.fn(() => ({ limit }));
    const sort = mock.fn(() => ({ skip }));
    mock.method(Student, 'find', () => ({ sort }));
    mock.method(Student, 'countDocuments', async () => 0);
    await getStudents({ query: { limit: '1000' } }, mockRes());
    assert.equal(limit.mock.calls[0].arguments[0], 100);
  });

  test('getStudent returns 404 when not found', async () => {
    mock.method(Student, 'findById', async () => null);
    const res = mockRes();
    await getStudent({ params: { id: 'missing' } }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
  });

  test('getStudent returns student when found', async () => {
    const student = { _id: '1', name: 'Aarav' };
    mock.method(Student, 'findById', async () => student);
    const res = mockRes();
    await getStudent({ params: { id: '1' } }, res);
    assert.deepEqual(res.body.data, student);
  });

  test('updateStudent returns updated student', async () => {
    const student = { _id: '1', name: 'Updated' };
    const update = mock.method(Student, 'findByIdAndUpdate', async () => student);
    const res = mockRes();
    await updateStudent({ params: { id: '1' }, body: { name: 'Updated', studentId: 'MUST-NOT-CHANGE' } }, res);
    assert.deepEqual(res.body.data, student);
    assert.deepEqual(update.mock.calls[0].arguments[1], { name: 'Updated' });
  });

  test('updateStudent returns 404 when missing', async () => {
    mock.method(Student, 'findByIdAndUpdate', async () => null);
    const res = mockRes();
    await updateStudent({ params: { id: 'missing' }, body: {} }, res);
    assert.equal(res.statusCode, 404);
  });

  test('deleteStudent cascades attendance and academic records', async () => {
    mock.method(Student, 'findByIdAndDelete', async () => ({ _id: '1' }));
    const attendanceDelete = mock.method(Attendance, 'deleteMany', async () => ({ deletedCount: 2 }));
    const academicDelete = mock.method(AcademicRecord, 'deleteMany', async () => ({ deletedCount: 1 }));
    const res = mockRes();
    await deleteStudent({ params: { id: '1' } }, res);
    assert.equal(res.statusCode, 204);
    assert.equal(attendanceDelete.mock.calls[0].arguments[0].student, '1');
    assert.equal(academicDelete.mock.calls[0].arguments[0].student, '1');
  });
});
