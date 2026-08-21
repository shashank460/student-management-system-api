import mongoose from 'mongoose';
import env from './env.js';
import logger from './logger.js';

export async function connectDatabase() {
  await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connected');
}

export function isDatabaseHealthy() {
  return mongoose.connection.readyState === 1;
}
