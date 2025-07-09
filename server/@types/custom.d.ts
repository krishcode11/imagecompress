import 'express-session';

// Base user type that matches the structure from firebaseAuth.ts
type BaseUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

// Extended user type with additional session properties
type SessionUser = BaseUser & {
  role?: string;
  lastIp?: string;
  userAgent?: string;
};

// Extend the Express namespace
declare global {
  namespace Express {
    // Extend the User interface to match our session user
    interface User extends SessionUser {}
    
    // Extend the Request interface to include our custom session
    interface Request {
      session: SessionUserSession;
    }
  }
}

// Define our custom session type
type SessionUserSession = Express.Session & {
  user?: SessionUser;
  lastActivity?: number;
  csrfToken?: string;
};

declare module 'express-session' {
  // Extend the SessionData interface to include our custom properties
  interface SessionData {
    user?: SessionUser;
    lastActivity?: number;
    csrfToken?: string;
  }

  // Extend the Session interface to include our custom methods
  interface Session {
    regenerate(callback: (err: Error | null) => void): void;
    destroy(callback: (err: Error | null) => void): void;
    reload(callback: (err: Error | null) => void): void;
    save(callback?: (err: Error | null) => void): void;
    touch(): void;
    cookie: any;
  }
}
