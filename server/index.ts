import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from 'path';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { setupVite, serveStatic, log } from "./vite.js";
import { initializeSubscriptionPlans } from "./init-plans.js";
import { getStorage } from "./storage.js";
import { isAuthenticated, verifyFirebaseToken, setupAuth } from "./firebaseAuth.js";
import { authRateLimiter } from "./middleware/rateLimiter.js";
import http from 'http';
import { errorHandler } from "./middleware/errorHandler.js";
import { upload } from "./middleware/upload.js";
import { validateImage } from "./middleware/imageValidation.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import { sessionMiddleware } from "./middleware/session.js";
import { validateEnv } from "./middleware/envValidation.js";
import { inputSanitizer } from "./middleware/sanitizer.js";
import { csrfProtection } from "./middleware/csrf.js";
import { corsMiddleware } from "./middleware/corsConfig.js";

// Import controllers
import * as userController from "./controllers/userController.js";
import * as subscriptionController from "./controllers/subscriptionController.js";
import * as imageController from "./controllers/imageController.js";
import * as adminController from "./controllers/adminController.js";
import * as contactController from "./controllers/contactController.js";
import * as paymentController from "./controllers/paymentController.js";

// Validate required environment variables
const requiredEnvVars = [
  'SESSION_SECRET',
  'DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'ADMIN_EMAIL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingEnvVars);
  console.error("   Please set these variables in your .env file");
  console.error("   Create a .env file in your project root with these variables:");
  missingEnvVars.forEach(varName => {
    console.error(`   ${varName}=your_${varName.toLowerCase()}_here`);
  });
  process.exit(1);
}

const app = express();

// Security middleware
const isDevelopment = process.env.NODE_ENV === 'development';

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"], // 'unsafe-inline' for styles is less risky but ideally should be removed
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: ["'self'", "https:"],
  fontSrc: ["'self'", "https:"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
};

// In development, relax CSP for Vite HMR and other tools
if (isDevelopment) {
  cspDirectives.scriptSrc.push("'unsafe-inline'", "'unsafe-eval'");
  // Vite's HMR client needs to connect via WebSocket
  cspDirectives.connectSrc.push('ws:');
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: cspDirectives,
  },
  // Keep this false to allow some cross-origin requests if needed by your app
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(corsMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const ip = req.ip || req.connection.remoteAddress;
    
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms - IP: ${ip}`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize security
app.use(securityHeaders);
app.use(sessionMiddleware);
app.use(inputSanitizer);
app.use(validateEnv);

(async () => {
  try {
    // Initialize storage and database connection
    await getStorage();
    
    // Initialize subscription plans on startup
    console.log("🚀 Starting server initialization...");
    await initializeSubscriptionPlans();
    console.log("✅ Server initialization complete");
  } catch (error) {
    console.error("❌ Failed to initialize server:", error);
    console.error("   Please ensure DATABASE_URL is set and the database is accessible");
    process.exit(1);
  }
  
  // Initialize authentication
  setupAuth(app);

  // Add CSRF protection
  app.use(csrfProtection);

  // Create HTTP server
  const server = http.createServer(app);

  // ========================
  // API Routes
  // ========================

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Authentication Routes
  // Auth Routes
  app.get('/api/auth/user', authRateLimiter, isAuthenticated, userController.getUserProfile);
  app.post('/api/auth/verify', authRateLimiter, (req, res) => res.status(200).json({ verified: true }));
  
  // User Routes
  app.put('/api/user/profile', isAuthenticated, userController.updateUserProfile);
  
  // Subscription Routes
  app.get('/api/subscription/plans', subscriptionController.getSubscriptionPlans);
  app.get('/api/subscription/status', isAuthenticated, subscriptionController.getSubscriptionStatus);
  app.post('/api/subscription/upgrade', isAuthenticated, subscriptionController.upgradeSubscription);
  
  // Image Routes
  app.post('/api/compress', 
    isAuthenticated, 
    upload.single('image'), 
    validateImage, // Apply sharp-based validation after multer
    imageController.compressImage
  );
  
  app.get('/api/stats/image', 
    isAuthenticated, 
    imageController.getImageStats
  );
  
  // Admin Routes (protected by verifyFirebaseToken which checks for admin role)
  app.get('/api/admin/subscriptions', 
    verifyFirebaseToken, 
    adminController.getAllSubscriptions
  );
  
  app.post('/api/admin/subscription/expire', 
    verifyFirebaseToken, 
    adminController.expireSubscription
  );
  
  app.get('/api/admin/stats', 
    verifyFirebaseToken, 
    adminController.getUserStats
  );
  
  app.put('/api/admin/plans/:planId', 
    verifyFirebaseToken, 
    adminController.updateSubscriptionPlan
  );

  // Contact Routes
  app.post('/api/contact', contactController.sendContactMessage);
  app.get('/api/tutorials', contactController.getTutorials);

  // Payment Routes
  app.post('/api/payment/success', paymentController.handlePaymentSuccess);
  app.post('/api/payment/failure', paymentController.handlePaymentFailure);

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Error handling
  app.use(errorHandler);

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  // Global error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error details
    console.error("❌ Server error:", {
      status,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      url: _req.url,
      method: _req.method,
      ip: _req.ip,
    });

    // Don't expose internal errors in production
    const responseMessage = process.env.NODE_ENV === "production" && status === 500 
      ? "Internal Server Error" 
      : message;

    res.status(status).json({ 
      error: responseMessage,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  });

  // Setup Vite in development mode
  if (app.get("env") === "development") {
    console.log('🚀 Running in development mode with Vite');
    await setupVite(app, server);
  } else {
    console.log('🏗️  Running in production mode');
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`Security: Helmet, CORS, Rate Limiting enabled`);
  });
})();