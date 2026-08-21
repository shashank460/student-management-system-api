import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent, getAttendanceSummary, getAcademicSummary } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { studentCreateSchema, studentUpdateSchema, studentIdParamSchema, studentSummaryParamSchema, studentQuerySchema } from '../validators/schemas.js';

const router = Router();
router.route('/')
  .post(authenticate, validate({ body: studentCreateSchema }), createStudent)
  .get(validate({ query: studentQuerySchema }), getStudents);

router.get('/:id/attendance-summary', validate({ params: studentSummaryParamSchema }), getAttendanceSummary);
router.get('/:id/academic-summary', validate({ params: studentSummaryParamSchema }), getAcademicSummary);
router.route('/:id')
  .get(validate({ params: studentIdParamSchema }), getStudent)
  .patch(authenticate, validate({ params: studentIdParamSchema, body: studentUpdateSchema }), updateStudent)
  .delete(authenticate, authorize('admin'), validate({ params: studentIdParamSchema }), deleteStudent);

export default router;
