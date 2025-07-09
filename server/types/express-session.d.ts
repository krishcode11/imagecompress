// This file extends the express-session types with our custom session data

import 'express-session';

// Base user type that matches the expected structure
type BaseUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  role?: string;
};

declare global {
  namespace Express {
    // This matches the expected User type
    interface User extends BaseUser {}
    
    interface Request {
      user?: BaseUser;
    }
  }
}

declare module 'express-session' {
  // Extend the session data with our custom properties
  interface SessionData {
    user?: BaseUser & {
      lastIp?: string;
      userAgent?: string;
    };
    lastActivity?: number;
    csrfToken?: string;
  }
}

// Export the extended user type
// This is the type we'll use throughout our application
export type SessionUser = NonNullable<Express.Session['user']> & {
  lastIp?: string;
  userAgent?: string;
};

export {};
