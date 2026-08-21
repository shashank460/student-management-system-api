import AcademicRecord from '../models/AcademicRecord.js';
import Student from '../models/Student.js';

const UPDATABLE_FIELDS = ['semester', 'subjects'];

function pickFields(body, fields) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => fields.includes(key)));
}

export async function createAcademicRecord(req, res) {
  const student = await Student.exists({ _id: req.body.student });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const record = await AcademicRecord.create(req.body);
  res.status(201).json({ success: true, data: record });
}

export async function getAcademicRecords(req, res) {
  const filter = req.params.studentId ? { student: req.params.studentId } : {};
  const records = await AcademicRecord.find(filter).populate('student', 'studentId name').sort({ semester: 1 });
  res.json({ success: true, count: records.length, data: records });
}

export async function updateAcademicRecord(req, res) {
  const record = await AcademicRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Academic record not found' });

  Object.assign(record, pickFields(req.body, UPDATABLE_FIELDS));
  await record.save();
  res.json({ success: true, data: record });
}

export async function deleteAcademicRecord(req, res) {
  const record = await AcademicRecord.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Academic record not found' });
  res.status(204).send();
}
