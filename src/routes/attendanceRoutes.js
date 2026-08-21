import { Router } from 'express';
import { createAttendance, getAttendance, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { attendanceCreateSchema, attendanceUpdateSchema, attendanceIdParamSchema, attendanceStudentParamSchema } from '../validators/schemas.js';

const router = Router();
router.post('/', authenticate, validate({ body: attendanceCreateSchema }), createAttendance);
router.get('/', validate(), getAttendance);
router.get('/student/:studentId', validate({ params: attendanceStudentParamSchema }), getAttendance);
router.patch('/:id', authenticate, validate({ params: attendanceIdParamSchema, body: attendanceUpdateSchema }), updateAttendance);
router.delete('/:id', authenticate, authorize('admin'), validate({ params: attendanceIdParamSchema }), deleteAttendance);
export default router;
