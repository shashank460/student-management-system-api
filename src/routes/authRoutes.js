import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { emptyQuerySchema, registerSchema, loginSchema, refreshSchema } from '../validators/schemas.js';

const router = Router();
router.post('/register', validate({ body: registerSchema, query: emptyQuerySchema }), register);
router.post('/login', validate({ body: loginSchema, query: emptyQuerySchema }), login);
router.post('/refresh', validate({ body: refreshSchema, query: emptyQuerySchema }), refresh);
router.post('/logout', validate({ body: refreshSchema, query: emptyQuerySchema }), logout);
export default router;
