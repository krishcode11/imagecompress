import 'express-session';

declare global {
  namespace Express {
    // Base user type that matches the expected structure
    interface BaseUser {
      id: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      role?: string;
    }

    // Extended user type with session-specific properties
    interface SessionUser extends BaseUser {
      lastIp?: string;
      userAgent?: string;
    }

    // Extend the Request type to include our custom session
    interface Request {
      session: Session & {
        user?: SessionUser;
        lastActivity?: number;
        csrfToken?: string;
      };
    }
  }
}

// Export the extended session user type
export type { SessionUser } from 'express';

// Extend the express-session module
declare module 'express-session' {
  interface SessionData {
    user?: Express.SessionUser;
    lastActivity?: number;
    csrfToken?: string;
  }
}

// This helps TypeScript understand our custom session properties
declare module 'express-serve-static-core' {
  interface Request {
    session: Express.Request['session'];
  }
}
