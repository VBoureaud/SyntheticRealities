import mongoose from 'mongoose';
import config from '../config';
import logger from '../config/logger';
import { Card } from '../models/card.model';
import cardsJson from './cards.json';

let server: any;

const seedCards = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
    
    logger.info('Start insertMany... Please wait');
    const count = await Card.countDocuments({});
    
    if (!count) {
      await Card.insertMany(cardsJson);
      logger.info('Data inserted');
    } else {
      logger.info('You already have filled your db.');
    }
    
    await exitHandler();
  } catch (error) {
    logger.error('Error seeding cards:', error);
    await exitHandler();
  }
};

const exitHandler = async (): Promise<void> => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info('Server closed');
        resolve();
      });
    });
  }
  process.exit(0);
};

const unexpectedErrorHandler = (error: Error): void => {
  logger.error(error);
  exitHandler();
};

// Handle process events
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

// Run the seeding process
seedCards();