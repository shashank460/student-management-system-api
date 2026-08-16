import { Router } from 'express';
import { createAcademicRecord, getAcademicRecords, updateAcademicRecord, deleteAcademicRecord } from '../controllers/academicController.js';

const router = Router();
router.post('/', createAcademicRecord);
router.get('/', getAcademicRecords);
router.get('/student/:studentId', getAcademicRecords);
router.patch('/:id', updateAcademicRecord);
router.delete('/:id', deleteAcademicRecord);
export default router;
