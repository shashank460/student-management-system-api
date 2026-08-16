import { Router } from 'express';
import { createAttendance, getAttendance, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';

const router = Router();
router.post('/', createAttendance);
router.get('/', getAttendance);
router.get('/student/:studentId', getAttendance);
router.patch('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);
export default router;
