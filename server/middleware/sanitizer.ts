import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Define types for sanitized objects
interface SanitizedObject {
  [key: string]: string | number | boolean | SanitizedObject | SanitizedObject[];
}

const sanitizeString = (str: string): string => {
  // Remove HTML tags and special characters
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/[^\w\s@.-]/g, '');
};

const sanitizeObject = (obj: unknown): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const sanitized: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const inputSanitizer = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
};
