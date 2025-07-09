import 'express-session';

declare module 'express-session' {
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

  // Extend the SessionData interface with our custom properties
  interface SessionData {
    user?: SessionUser;
    lastActivity?: number;
    csrfToken?: string;
  }
}

// Extend the Express namespace
declare global {
  namespace Express {
    // Re-export the SessionUser interface
    interface SessionUser extends Session.SessionUser {}

    // Extend the Request interface to include our custom session
    interface Request {
      session: Session & {
        user?: SessionUser;
        lastActivity?: number;
        csrfToken?: string;
      };
    }
  }
}

// Export the SessionUser type for use in other files
export type { SessionUser } from 'express-session';
