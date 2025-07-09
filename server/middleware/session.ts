import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Import the SessionUser type from firebaseAuth
import type { SessionUser } from '../firebaseAuth.js';

// Extend the session types to include our custom properties
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
    lastActivity?: number;
    csrfToken?: string;
  }
}

// -------------------- Session Store Setup --------------------
// We prefer Redis for persistence, but gracefully fall back to MemoryStore
// in local development or if Redis is unavailable.
let redisStore: session.Store;

if (process.env.UPSTASH_REDIS_URL) {
  try {
    console.log('--- Attempting to connect to Upstash Redis ---');

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({ url: process.env.UPSTASH_REDIS_URL });

    redisClient.on('error', (err: unknown) => console.error('❌ Redis Client Error', err));
    redisClient.on('connect', () => console.log('✅ Successfully connected to Redis.'));

    // Start the async connection if using redis v4;
    // the older client does not have .connect().
    if (typeof (redisClient as any).connect === 'function') {
      (redisClient as any).connect().catch((err: unknown) => {
        console.error('❌ Redis connection failed:', err);
      });
    }

    redisStore = new RedisStore({ client: redisClient, prefix: 'sess:' });
  } catch (err: unknown) {
    console.warn('⚠️ Redis initialization failed, using MemoryStore:', err);
    redisStore = new session.MemoryStore();
  }
} else {
  console.warn('⚠️ UPSTASH_REDIS_URL not set, using MemoryStore');
  redisStore = new session.MemoryStore();
}

// Session configuration
const sessionMiddleware = session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || 'your-default-session-secret',
  resave: false,
  saveUninitialized: false,
  genid: () => uuidv4(),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});

export { sessionMiddleware };
