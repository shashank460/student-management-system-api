import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { requireApiKey } from './middleware/apiKeyAuth.js';
import env from './config/env.js';

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ success: true, service: 'student-management-system-api', status: 'healthy' }));
app.use('/api/v1', apiLimiter);
app.use('/api/v1', requireApiKey);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/academics', academicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
