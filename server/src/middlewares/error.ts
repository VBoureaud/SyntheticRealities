import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorConverter = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || (httpStatus as any)[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err as ApiError;
  if (config.env === 'production' && !(err as ApiError).isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = (httpStatus as any)[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
}; 