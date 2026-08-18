import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

const UPDATABLE_FIELDS = ['date', 'status'];

function normalizeDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function pickFields(body, fields) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => fields.includes(key)));
}

export async function createAttendance(req, res) {
  const student = await Student.exists({ _id: req.body.student });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const date = normalizeDate(req.body.date);
  if (!date) return res.status(400).json({ success: false, message: 'Invalid attendance date' });

  const record = await Attendance.create({ student: req.body.student, date, status: req.body.status });
  res.status(201).json({ success: true, data: record });
}

export async function getAttendance(req, res) {
  const filter = req.params.studentId ? { student: req.params.studentId } : {};
  const records = await Attendance.find(filter).populate('student', 'studentId name').sort({ date: -1 });
  res.json({ success: true, count: records.length, data: records });
}

export async function updateAttendance(req, res) {
  const updates = pickFields(req.body, UPDATABLE_FIELDS);
  if (updates.date !== undefined) {
    updates.date = normalizeDate(updates.date);
    if (!updates.date) return res.status(400).json({ success: false, message: 'Invalid attendance date' });
  }
  const record = await Attendance.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.json({ success: true, data: record });
}

export async function deleteAttendance(req, res) {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.status(204).send();
}
