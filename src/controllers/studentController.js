import Student from '../models/Student.js';

export async function createStudent(req, res) {
  const student = await Student.create(req.body);
  res.status(201).json({ success: true, data: student });
}

export async function getStudents(req, res) {
  const { department, semester } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);
  const students = await Student.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: students.length, data: students });
}

export async function getStudent(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
}

export async function updateStudent(req, res) {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
}

export async function deleteStudent(req, res) {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.status(204).send();
}
