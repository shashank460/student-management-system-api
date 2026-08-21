import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { emptyQuerySchema, registerSchema, loginSchema } from '../validators/schemas.js';

const router = Router();
router.post('/register', validate({ body: registerSchema, query: emptyQuerySchema }), register);
router.post('/login', validate({ body: loginSchema, query: emptyQuerySchema }), login);
export default router;
