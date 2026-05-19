import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  // Log error with context for debugging
  console.error(`[ERROR] ${req.method} ${req.url}`, {
    message: error.message,
    stack: error.stack,
    ...(error instanceof ApiError && { statusCode: error.statusCode }),
  });

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};
