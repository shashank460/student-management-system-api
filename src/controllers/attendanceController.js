import Attendance from '../models/Attendance.js';

export async function createAttendance(req, res) {
  const record = await Attendance.create(req.body);
  res.status(201).json({ success: true, data: record });
}

export async function getAttendance(req, res) {
  const filter = req.params.studentId ? { student: req.params.studentId } : {};
  const records = await Attendance.find(filter).populate('student', 'studentId name').sort({ date: -1 });
  res.json({ success: true, count: records.length, data: records });
}

export async function updateAttendance(req, res) {
  const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.json({ success: true, data: record });
}

export async function deleteAttendance(req, res) {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.status(204).send();
}
