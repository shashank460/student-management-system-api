import { Router } from 'express';
import { createAcademicRecord, getAcademicRecords, updateAcademicRecord, deleteAcademicRecord } from '../controllers/academicController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { emptyQuerySchema, academicCreateSchema, academicUpdateSchema, academicIdParamSchema, academicStudentParamSchema } from '../validators/schemas.js';

const router = Router();
router.post('/', authenticate, validate({ body: academicCreateSchema, query: emptyQuerySchema }), createAcademicRecord);
router.get('/', validate({ query: emptyQuerySchema }), getAcademicRecords);
router.get('/student/:studentId', validate({ params: academicStudentParamSchema, query: emptyQuerySchema }), getAcademicRecords);
router.patch('/:id', authenticate, validate({ params: academicIdParamSchema, body: academicUpdateSchema, query: emptyQuerySchema }), updateAcademicRecord);
router.delete('/:id', authenticate, authorize('admin'), validate({ params: academicIdParamSchema, query: emptyQuerySchema }), deleteAcademicRecord);
export default router;
