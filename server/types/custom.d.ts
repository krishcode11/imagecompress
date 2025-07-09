import { SessionUser } from './express-session';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
    
    interface User {
      id: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      role?: string;
    }
  }
}
