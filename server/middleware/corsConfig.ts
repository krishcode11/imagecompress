import cors from 'cors';

// Reading allowed origins from environment variables.
// This should be a comma-separated string of URLs.
// Example: 'https://your-vercel-app.vercel.app,http://localhost:5173'
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];

if (allowedOrigins.length === 0) {
  console.warn('ALLOWED_ORIGINS environment variable is not set. CORS will block all cross-origin requests.');
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if the origin is in the whitelist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      // Block other origins
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'Origin', 'Referer', 'Accept'],
  exposedHeaders: ['x-csrf-token'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // 24 hours
};

export const corsMiddleware = cors(corsOptions);
