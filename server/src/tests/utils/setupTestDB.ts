import mongoose from 'mongoose';
import config from './test_config';
import logger from '../../config/logger';

export const setupTestDB = () => {
  beforeAll(async () => {
    // Ensure we're disconnected from any existing connections
    await mongoose.disconnect();
    
    // Connect to test database
    const testDbUrl = `${config.mongoose.url}_test`;
    await mongoose.connect(testDbUrl, config.mongoose.options);
    
    // Verify we're connected to test database
    const dbName = mongoose.connection.db.databaseName;
    if (!dbName.endsWith('_test')) {
      throw new Error('Not connected to test database!');
    }
  });

  afterAll(async () => {
    // Only drop if we're in test database
    const dbName = mongoose.connection.db.databaseName;
    if (dbName.endsWith('_test')) {
      await mongoose.connection.dropDatabase();
      logger.info(`Dropped test database: ${dbName}`);
    } else {
      logger.warn('Skipping database drop - not a test database');
    }
    await mongoose.disconnect();
  });
}; 