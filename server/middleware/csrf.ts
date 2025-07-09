import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';

// Define CSRF token schema
const csrfSchema = z.object({
  'x-csrf-token': z.string().min(32).max(32).regex(/^[a-f0-9]+$/)
});


export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  try {
    // For GET/HEAD requests, ensure a token exists and send it to the client.
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(16).toString('hex');
      }
      res.setHeader('x-csrf-token', req.session.csrfToken);
      return next();
    }

    const headerToken = req.headers['x-csrf-token'];
    const sessionToken = req.session.csrfToken;

    if (!headerToken || !sessionToken) {
      return res.status(403).json({ error: 'CSRF token is missing.' });
    }

    // Validate token format
    const parsedHeader = csrfSchema.safeParse({ 'x-csrf-token': headerToken });
    if (!parsedHeader.success) {
      return res.status(403).json({ error: 'Invalid CSRF token format.' });
    }

    // Use timing-safe comparison to prevent timing attacks
    const isEqual = crypto.timingSafeEqual(Buffer.from(headerToken as string), Buffer.from(sessionToken));

    if (!isEqual) {
      return res.status(403).json({ error: 'Invalid CSRF token.' });
    }

    next();

  } catch (error) {
    console.error('CSRF validation error:', error);
    return res.status(500).json({ error: 'An internal error occurred during CSRF validation.' });
  }
};
