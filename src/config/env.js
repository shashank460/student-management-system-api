import dotenv from 'dotenv';

dotenv.config();

const isTestRun = process.argv.includes('--test');
const mongoUri = process.env.MONGODB_URI || (isTestRun ? 'mongodb://127.0.0.1:27017/test-placeholder' : undefined);

const env = {
  nodeEnv: process.env.NODE_ENV || (isTestRun ? 'test' : 'development'),
  port: Number(process.env.PORT) || 5000,
  mongoUri,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiKey: process.env.API_KEY || ''
};

if (!env.mongoUri) {
  throw new Error('MONGODB_URI is required outside test runs');
}

export default env;
