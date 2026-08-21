import { Router } from 'express';
import { createAttendance, getAttendance, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { emptyQuerySchema, attendanceCreateSchema, attendanceUpdateSchema, attendanceIdParamSchema, attendanceStudentParamSchema } from '../validators/schemas.js';

const router = Router();
router.post('/', authenticate, validate({ body: attendanceCreateSchema, query: emptyQuerySchema }), createAttendance);
router.get('/', validate({ query: emptyQuerySchema }), getAttendance);
router.get('/student/:studentId', validate({ params: attendanceStudentParamSchema, query: emptyQuerySchema }), getAttendance);
router.patch('/:id', authenticate, validate({ params: attendanceIdParamSchema, body: attendanceUpdateSchema, query: emptyQuerySchema }), updateAttendance);
router.delete('/:id', authenticate, authorize('admin'), validate({ params: attendanceIdParamSchema, query: emptyQuerySchema }), deleteAttendance);
export default router;
