import 'express-session';

declare global {
  namespace Express {
    // Base User type that matches the database model
    interface User {
      id: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      role?: string;
    }

    // Extended user interface with session-specific properties
    interface SessionUser extends User {
      lastIp?: string;
      userAgent?: string;
    }

    // Extend the Request interface to include our custom session
    interface Request {
      session: session.Session & {
        user?: SessionUser;
        lastActivity?: number;
        csrfToken?: string;
      };
    }
  }
}

// Extend the express-session module
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      role?: string;
      lastIp?: string;
      userAgent?: string;
    };
    lastActivity?: number;
    csrfToken?: string;
  }
}
