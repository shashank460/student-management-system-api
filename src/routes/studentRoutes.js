import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent, getAttendanceSummary, getAcademicSummary } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { emptyQuerySchema, studentCreateSchema, studentUpdateSchema, studentIdParamSchema, studentSummaryParamSchema, studentQuerySchema } from '../validators/schemas.js';

const router = Router();
router.route('/')
  .post(authenticate, validate({ body: studentCreateSchema, query: emptyQuerySchema }), createStudent)
  .get(validate({ query: studentQuerySchema }), getStudents);

router.get('/:id/attendance-summary', validate({ params: studentSummaryParamSchema, query: emptyQuerySchema }), getAttendanceSummary);
router.get('/:id/academic-summary', validate({ params: studentSummaryParamSchema, query: emptyQuerySchema }), getAcademicSummary);
router.route('/:id')
  .get(validate({ params: studentIdParamSchema, query: emptyQuerySchema }), getStudent)
  .patch(authenticate, validate({ params: studentIdParamSchema, body: studentUpdateSchema, query: emptyQuerySchema }), updateStudent)
  .delete(authenticate, authorize('admin'), validate({ params: studentIdParamSchema, query: emptyQuerySchema }), deleteStudent);

export default router;
