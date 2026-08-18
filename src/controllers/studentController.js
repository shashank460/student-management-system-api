import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import AcademicRecord from '../models/AcademicRecord.js';

const UPDATABLE_FIELDS = ['name', 'email', 'department', 'semester', 'phone', 'enrollmentYear'];

function pickFields(body, fields) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => fields.includes(key)));
}

export async function createStudent(req, res) {
  const student = await Student.create(req.body);
  res.status(201).json({ success: true, data: student });
}

export async function getStudents(req, res) {
  const { department, semester } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(filter)
  ]);

  res.json({ success: true, count: students.length, total, page, totalPages: Math.ceil(total / limit) || 1, data: students });
}

export async function getStudent(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
}

export async function updateStudent(req, res) {
  const updates = pickFields(req.body, UPDATABLE_FIELDS);
  const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, data: student });
}

export async function deleteStudent(req, res) {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  await Promise.all([
    Attendance.deleteMany({ student: student._id }),
    AcademicRecord.deleteMany({ student: student._id })
  ]);

  res.status(204).send();
}
