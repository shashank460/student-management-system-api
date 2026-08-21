import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const UPDATABLE_FIELDS = ['date', 'status'];

function pickFields(body, fields) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => fields.includes(key)));
}

export async function createAttendance(req, res) {
  const student = await Student.exists({ _id: req.body.student });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const record = await Attendance.create(req.body);
  res.status(201).json({ success: true, data: record });
}

export async function getAttendance(req, res) {
  const filter = req.params.studentId ? { student: req.params.studentId } : {};
  const records = await Attendance.find(filter).populate('student', 'studentId name').sort({ date: -1 });
  res.json({ success: true, count: records.length, data: records });
}

export async function updateAttendance(req, res) {
  const record = await Attendance.findById(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });

  Object.assign(record, pickFields(req.body, UPDATABLE_FIELDS));
  await record.save();
  res.json({ success: true, data: record });
}

export async function deleteAttendance(req, res) {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.status(204).send();
}
