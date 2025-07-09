import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Log error details
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query
    });
  }

  // Send appropriate error response
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof Error) {
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Invalid input data';
    } else if (err.name === 'AuthenticationError') {
      statusCode = 401;
      message = 'Authentication required';
    } else if (err.name === 'AuthorizationError') {
      statusCode = 403;
      message = 'Permission denied';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      message = 'Resource not found';
    } else if (err.name === 'RateLimitError') {
      statusCode = 429;
      message = 'Too many requests. Please wait a few minutes before trying again.';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' ? { details: err.message } : {})
  });
};
