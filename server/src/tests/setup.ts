import mongoose from 'mongoose';
import config from '../config';
import logger from '../config/logger';

beforeAll(async () => {
  try {
    await mongoose.connect(config.mongoose.url + '-test');
    logger.info('Connected to MongoDB test database');
  } catch (error) {
    logger.error('Error connecting to MongoDB test database:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}); 