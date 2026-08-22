import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isTest = nodeEnv === 'test';

const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || (isTest ? 'mongodb://127.0.0.1:27017/student_management_test' : ''),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || (isTest ? 'test-only-jwt-secret-change-me' : ''),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || (isTest ? 'test-only-refresh-secret-change-me' : ''),
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};

if (!env.mongoUri) throw new Error('MONGODB_URI is required');
if (!env.jwtSecret) throw new Error('JWT_SECRET is required');
if (!env.refreshTokenSecret) throw new Error('REFRESH_TOKEN_SECRET is required');
if (nodeEnv === 'production') {
  if (env.jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production');
  if (env.refreshTokenSecret.length < 32) throw new Error('REFRESH_TOKEN_SECRET must be at least 32 characters in production');
}

export default env;
