import mongoose from 'mongoose';
import app from './app';
import config from './config';
import logger from './config/logger';
import os from 'os';

let server: any;

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
    
    server = app.listen(config.port, () => {
      const networkInterfaces = os.networkInterfaces();
      const addresses = Object.values(networkInterfaces)
        .flat()
        .filter((interfaceInfo) => interfaceInfo?.family === 'IPv4' && !interfaceInfo.internal)
        .map((interfaceInfo) => interfaceInfo?.address);

      logger.info('Server is running on:');
      addresses.forEach((address) => {
        logger.info(`http://${address}:${config.port}`);
      });
      logger.info(`Local: http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const exitHandler = async (): Promise<void> => {
  try {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      logger.info('Server closed');
    }
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during cleanup:', error);
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error): void => {
  logger.error('Unhandled error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGINT', exitHandler);

startServer(); 