import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: {
    error: "Too many authentication attempts from this IP. Please wait 15 minutes before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use IP + user ID if available, otherwise just IP
    const ip = req.ip || 'unknown';
    const userId = req.user?.id;
    return userId ? `${ip}:${userId}` : ip;
  },
  skip: (req: Request) => {
    // Skip rate limiting for localhost in development
    const ip = req.ip || 'unknown';
    return process.env.NODE_ENV === 'development' && 
           (ip === '::1' || ip === '127.0.0.1');
  }
});

// Rate limiter for image compression
export const compressionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each user/IP to 10 compressions per windowMs
  message: {
    error: "Too many compression requests. Please wait 15 minutes before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use both user ID and IP for rate limiting
    const ip = req.ip || 'unknown';
    const userId = req.user?.id;
    return userId ? `${userId}-${ip}` : ip;
  }
});

// Rate limiter for API endpoints
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
  message: {
    error: "Too many API requests from this IP. Please wait 1 minute before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for localhost in development
    const ip = req.ip || 'unknown';
    return process.env.NODE_ENV === 'development' && 
           (ip === '::1' || ip === '127.0.0.1');
  }
});
