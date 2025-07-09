import type { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { getStorage } from './storage.js';

// --- TYPE DEFINITIONS ---

/**
 * @description Base user properties derived from Firebase token.
 */
export interface BaseUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

/**
 * @description User properties stored in the session, extending BaseUser.
 */
export type SessionUser = BaseUser & {
  role?: string;
  lastIp?: string;
  userAgent?: string;
};

// --- MODULE AUGMENTATION ---

// Extend Express Session to include our custom SessionUser type.
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}

// Extend Express Request to include our custom user type for middleware communication.
declare global {
  namespace Express {
    interface Request {
      user?: BaseUser;
    }
  }
}

// --- FIREBASE INITIALIZATION ---

let firebaseAuth: Auth;
let isFirebaseInitialized = false;

/**
 * @description Initializes the Firebase Admin SDK using environment variables.
 * This function should be called once at application startup.
 */
function initializeFirebase() {
  if (getApps().length) {
    console.log('✅ Firebase Admin SDK already initialized.');
    isFirebaseInitialized = true;
    firebaseAuth = getAuth();
    return;
  }

  console.log('🔧 Initializing Firebase Admin SDK...');

  const { 
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL
  } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    console.warn('⚠️ Missing Firebase credentials. Auth features will be disabled.');
    return;
  }

  try {
    const serviceAccount: ServiceAccount = {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines from .env file with actual newlines.
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    initializeApp({ credential: cert(serviceAccount) });
    firebaseAuth = getAuth();
    isFirebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully.');

  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    // Prevent application from running with a broken auth configuration.
    process.exit(1);
  }
}

// Immediately invoke initialization at module load.
initializeFirebase();

// --- MIDDLEWARE ---

/**
 * @description Middleware to verify a Firebase ID token from the Authorization header.
 * Attaches the decoded user payload to `req.user` on success.
 */
export const verifyFirebaseToken: RequestHandler = async (req, res, next) => {
  if (!isFirebaseInitialized) {
    return res.status(503).json({
      message: 'Authentication service is not available.',
      error: 'Firebase has not been initialized on the server.',
    });
  }

  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // Attach a normalized user object to the request for the next middleware.
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email || null,
      firstName: decodedToken.name?.split(' ')[0] || null,
      lastName: decodedToken.name?.split(' ').slice(1).join(' ') || null,
      profileImageUrl: decodedToken.picture || null,
    };

    console.log(`👤 [verifyFirebaseToken] User authenticated: ${req.user.email} (${req.user.id})`);
    return next();

  } catch (error) {
    console.error('❌ [verifyFirebaseToken] Token verification failed:', error);
    let errorMessage = 'Invalid or expired token.';
    if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        if (firebaseError.code === 'auth/id-token-expired') {
            errorMessage = 'Your session has expired. Please sign in again.';
        }
    }
    return res.status(401).json({ message: 'Authentication failed.', error: errorMessage });
  }
};

/**
 * @description Middleware to check if a user is authenticated via an active session.
 * Protects routes that require a logged-in user.
 */
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'You must be logged in to access this resource.' });
};

// --- AUTH ROUTE SETUP ---

/**
 * @description Sets up authentication-related routes for the Express app.
 * @param app The Express application instance.
 */
export function setupAuth(app: Express) {
  // This endpoint is called by the client after a successful Firebase sign-in.
  // It verifies the token, creates a user record, and establishes a server session.
  app.post('/api/auth/verify', verifyFirebaseToken, async (req, res) => {
    // Debug logs for tracing
    console.log("🔐 Reached /api/auth/verify route");
    console.log("Token:", req.headers.authorization?.slice(0, 20), "...");
    if (!isFirebaseInitialized) console.log("⚠️ Firebase not initialized");
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'User data is incomplete or email is missing.' });
    }

    try {
      let storageAvailable = true;
      let storage: Awaited<ReturnType<typeof getStorage>> | null = null;
      try {
        storage = await getStorage();
      } catch (dbErr) {
        storageAvailable = false;
        console.warn('⚠️ Database unavailable, proceeding without upsertUser:', dbErr);
      }

      if (storageAvailable && storage) {
        // The user object is confirmed to have an email, so we can safely cast it.
        await storage.upsertUser(req.user as BaseUser & { email: string });
      }

      // The user is now verified. Create a session for them.
      const sessionUser: SessionUser = {
        ...req.user,
        lastIp: req.ip,
        userAgent: req.headers['user-agent'],
      };

      req.session.user = sessionUser;

      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save failed:', err);
          return res.status(500).json({ message: 'Failed to save session.' });
        }
        console.log(`✅ Session created for user: ${sessionUser.email}`);
        return res.status(200).json({ user: sessionUser, message: 'Authentication successful.' });
      });

    } catch (error) {
      console.error('❌ Error during user upsert or session creation:', error);
      return res.status(500).json({ message: 'An internal error occurred during authentication.' });
    }
  });

  // Endpoint to log the user out by destroying the session.
  app.get('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Logout failed:', err);
        return res.status(500).json({ message: 'Logout failed.' });
      }
      res.clearCookie('connect.sid'); // Ensure the session cookie is cleared.
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  });

  // Endpoint to get the current user from the session.
  app.get('/api/auth/user', isAuthenticated, (req, res) => {
    return res.status(200).json(req.session.user);
  });
}