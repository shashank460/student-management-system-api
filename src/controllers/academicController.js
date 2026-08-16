import AcademicRecord from '../models/AcademicRecord.js';

export async function createAcademicRecord(req, res) {
  const record = await AcademicRecord.create(req.body);
  res.status(201).json({ success: true, data: record });
}

export async function getAcademicRecords(req, res) {
  const filter = req.params.studentId ? { student: req.params.studentId } : {};
  const records = await AcademicRecord.find(filter).populate('student', 'studentId name').sort({ semester: 1 });
  res.json({ success: true, count: records.length, data: records });
}

export async function updateAcademicRecord(req, res) {
  const record = await AcademicRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) return res.status(404).json({ success: false, message: 'Academic record not found' });
  res.json({ success: true, data: record });
}

export async function deleteAcademicRecord(req, res) {
  const record = await AcademicRecord.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Academic record not found' });
  res.status(204).send();
}
