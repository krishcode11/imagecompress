import { Request, Response, NextFunction } from 'express';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Set security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Content Security Policy - build safely
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      `connect-src 'self' ${process.env.VITE_API_URL || 'https:'} ws: wss:`,
      "font-src 'self'",
      "object-src 'none'",
      "media-src 'self' data: blob:",
      "frame-src 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "worker-src 'self' blob:",
      "child-src 'self'",
      "frame-ancestors 'none'",
      "manifest-src 'self'",
      "upgrade-insecure-requests"
      // Removed plugin-types and block-all-mixed-content as they're deprecated
    ];
    
    const csp = cspDirectives.join('; ');
    console.log('Setting CSP:', csp); // Debug log
    
    res.setHeader('Content-Security-Policy', csp);
    
    // Additional security headers
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  } catch (error) {
    console.error('Error setting security headers:', error);
    // Continue without security headers rather than breaking the request
    next();
  }
};

// Development-friendly version with relaxed CSP
export const securityHeadersDev = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // More relaxed CSP for development
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' localhost:* 127.0.0.1:*",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' ws: wss: localhost:* 127.0.0.1:* https:",
      "font-src 'self'",
      "object-src 'none'",
      "media-src 'self' data: blob:",
      "frame-src 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "worker-src 'self' blob:",
      "child-src 'self'",
      "frame-ancestors 'none'",
      "manifest-src 'self'"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', csp);
    
    // Skip HSTS in development
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    next();
  } catch (error) {
    console.error('Error setting security headers:', error);
    next();
  }
};

// Minimal security headers for debugging
export const securityHeadersMinimal = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Very basic CSP that shouldn't cause issues
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: ws: wss:");
    
    next();
  } catch (error) {
    console.error('Error setting security headers:', error);
    next();
  }
};

// Test function to validate CSP string
export const validateCSP = (csp: string): boolean => {
  try {
    // Check for common problematic characters
    const problematicChars = ['\n', '\r', '\t'];
    for (const char of problematicChars) {
      if (csp.includes(char)) {
        console.error(`CSP contains problematic character: ${JSON.stringify(char)}`);
        return false;
      }
    }
    
    // Check for brackets that might cause issues
    if (csp.includes('[') || csp.includes(']')) {
      console.error('CSP contains brackets which might cause issues');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating CSP:', error);
    return false;
  }
};