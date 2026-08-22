import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import { authenticate } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { healthCheck } from './middleware/healthCheck.js';
import { openapiDocument } from './docs/openapi.js';
import env from './config/env.js';

const app = express();
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false });

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.get('/health', healthCheck);
app.get('/api-docs.json', (_req, res) => res.json(openapiDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use('/api/v1', apiLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', authenticate, studentRoutes);
app.use('/api/v1/attendance', authenticate, attendanceRoutes);
app.use('/api/v1/academics', authenticate, academicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
