import { Router } from 'express';
import { createAcademicRecord, getAcademicRecords, updateAcademicRecord, deleteAcademicRecord } from '../controllers/academicController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { academicCreateSchema, academicUpdateSchema, academicIdParamSchema, academicStudentParamSchema } from '../validators/schemas.js';

const router = Router();
router.post('/', authenticate, validate({ body: academicCreateSchema }), createAcademicRecord);
router.get('/', validate(), getAcademicRecords);
router.get('/student/:studentId', validate({ params: academicStudentParamSchema }), getAcademicRecords);
router.patch('/:id', authenticate, validate({ params: academicIdParamSchema, body: academicUpdateSchema }), updateAcademicRecord);
router.delete('/:id', authenticate, authorize('admin'), validate({ params: academicIdParamSchema }), deleteAcademicRecord);
export default router;
