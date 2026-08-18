import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiKey: process.env.API_KEY || ''
};

if (!env.mongoUri) {
  throw new Error('MONGODB_URI is required');
}

if (env.nodeEnv === 'production' && !env.apiKey) {
  throw new Error('API_KEY is required in production');
}

export default env;
