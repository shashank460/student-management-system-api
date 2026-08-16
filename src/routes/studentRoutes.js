import { Router } from 'express';
import { createStudent, getStudents, getStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';

const router = Router();
router.route('/').post(createStudent).get(getStudents);
router.route('/:id').get(getStudent).patch(updateStudent).delete(deleteStudent);
export default router;
