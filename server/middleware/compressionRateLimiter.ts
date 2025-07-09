import rateLimit from 'express-rate-limit';

// Rate limiting for image compression
export const compressionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 compressions per windowMs
  message: {
    success: false,
    error: 'Too many compression requests. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP + user ID if available, otherwise just IP
    const ip = req.ip || 'unknown';
    const userId = (req as any).user?.id;
    return userId ? `${ip}:${userId}` : ip;
  },
  skip: (req) => {
    // Skip rate limiting for localhost in development
    return process.env.NODE_ENV === 'development' && 
           (req.ip === '::1' || req.ip === '127.0.0.1');
  }
});
