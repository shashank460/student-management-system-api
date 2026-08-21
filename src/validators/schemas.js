import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');
const email = z.string().email().max(254).transform((value) => value.toLowerCase());
export const emptyQuerySchema = z.object({}).strict();

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password: z.string().min(8).max(128)
}).strict();

export const loginSchema = z.object({ email, password: z.string().min(1).max(128) }).strict();

export const studentCreateSchema = z.object({
  studentId: z.string().trim().min(2).max(30),
  name: z.string().trim().min(2).max(80),
  email,
  department: z.string().trim().min(2).max(100),
  semester: z.coerce.number().int().min(1).max(12),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,19}$/).optional(),
  enrollmentYear: z.coerce.number().int().min(2000).max(new Date().getFullYear() + 1)
}).strict();

export const studentUpdateSchema = studentCreateSchema.partial().omit({ studentId: true }).strict();
export const studentIdParamSchema = z.object({ id: objectId }).strict();
export const studentSummaryParamSchema = z.object({ id: objectId }).strict();

export const studentQuerySchema = z.object({
  department: z.string().trim().min(1).max(100).optional(),
  semester: z.coerce.number().int().min(1).max(12).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
}).strict();

export const attendanceCreateSchema = z.object({
  student: objectId,
  date: z.coerce.date(),
  status: z.enum(['present', 'absent', 'late'])
}).strict();

export const attendanceUpdateSchema = z.object({
  date: z.coerce.date().optional(),
  status: z.enum(['present', 'absent', 'late']).optional()
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const attendanceIdParamSchema = z.object({ id: objectId }).strict();
export const attendanceStudentParamSchema = z.object({ studentId: objectId }).strict();

const subjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  marks: z.coerce.number().min(0).max(100)
}).strict();

export const academicCreateSchema = z.object({
  student: objectId,
  semester: z.coerce.number().int().min(1).max(12),
  subjects: z.array(subjectSchema).min(1).max(20)
}).strict();

export const academicUpdateSchema = z.object({
  semester: z.coerce.number().int().min(1).max(12).optional(),
  subjects: z.array(subjectSchema).min(1).max(20).optional()
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const academicIdParamSchema = z.object({ id: objectId }).strict();
export const academicStudentParamSchema = z.object({ studentId: objectId }).strict();
