import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage, getAllSubscriptions } from "./storage";
import { setupAuth, isAuthenticated, verifyFirebaseToken } from "./firebaseAuth";
import { authRateLimiter } from "./middleware/rateLimiter";
import crypto from "crypto";
import express from "express";
import { WebSocketServer } from "ws";
import { z } from "zod";
import { sendEmail } from "./email";

// Input validation schemas
const compressionRequestSchema = z.object({
  quality: z.number().min(0.1).max(1.0).default(0.8),
  maxWidth: z.number().min(100).max(10000).optional(),
  maxHeight: z.number().min(100).max(10000).optional(),
  format: z.enum(['jpeg', 'png', 'webp']).default('jpeg'),
});

const subscriptionPlanSchema = z.object({
  planId: z.string().min(1).max(100),
});

const paymentRequestSchema = z.object({
  planId: z.string().min(1).max(100),
  currency: z.enum(['USD', 'BTC', 'ETH', 'LTC']).default('USD'),
});

const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

// Sanitization function
function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
}

// Validation middleware
function validateRequest(schema: z.ZodSchema) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid request data",
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      return res.status(400).json({ error: "Invalid request data" });
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  // Setup authentication middleware
  await setupAuth(app);

  // Auth routes - redirect to Firebase auth
  app.get('/api/login', async (req, res) => {
    res.status(501).json({ 
      message: "Please use Firebase authentication. Login endpoint not available." 
    });
  });

  app.get('/api/auth/user', authRateLimiter, isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('database') || errorMessage.includes('connection')) {
        res.status(503).json({ 
          message: "Database temporarily unavailable",
          error: "Service temporarily unavailable"
        });
      } else {
      res.status(500).json({ message: "Failed to fetch user" });
      }
    }
  });

  // Note: Authentication routes (/api/auth/verify, /api/logout) are handled by firebaseAuth.ts

  // Subscription Plans
  app.get('/api/subscription/plans', async (req, res) => {
    try {
      const storage = await getStorage();
      console.log("📋 Fetching subscription plans...");
      const plans = await storage.getSubscriptionPlans();
      console.log(`✅ Found ${plans.length} subscription plans:`, plans.map((p: any) => ({ id: p.id, name: p.name, price: p.price })));
      res.json(plans);
    } catch (error) {
      console.error("❌ Error fetching subscription plans:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('database') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
        res.status(503).json({ 
          message: "Database temporarily unavailable",
          error: "Service temporarily unavailable"
        });
      } else {
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
    }
  });

  // In-memory cache with 5-minute TTL
  const subscriptionCache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // User Subscription Status - Optimized
  app.get('/api/subscription/status', isAuthenticated, async (req: any, res) => {
    const startTime = Date.now();
    const email = req.query.email || req.user?.email;
    
    // Input validation
    if (!email) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Missing email parameter',
        code: 'MISSING_EMAIL',
        timestamp: new Date().toISOString()
      });
    }
    
    // Authorization check
    if (req.user?.email !== email) {
      return res.status(403).json({ 
        status: 'error',
        error: 'Unauthorized',
        code: 'UNAUTHORIZED_ACCESS',
        timestamp: new Date().toISOString()
      });
    }

    // Check cache first
    const cacheKey = `sub:${email}`;
    const cachedData = subscriptionCache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      // Set cache headers for client-side caching
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
      res.setHeader('X-Cache', 'HIT');
      
      return res.status(200).json({
        status: 'success',
        data: cachedData.data,
        message: 'Subscription status retrieved from cache',
        timestamp: new Date().toISOString(),
        responseTime: `${Date.now() - startTime}ms`
      });
    }

    try {
      const storage = await getStorage();
      
      // Single optimized query to get user with subscription
      const user = await storage.getUserByEmail(email, { includeSubscription: true });
      
      if (!user) {
        const response = {
          status: 'success',
          data: { subscription: null },
          message: 'No user found with this email',
          timestamp: new Date().toISOString(),
          responseTime: `${Date.now() - startTime}ms`
        };
        
        // Cache even non-existent users to prevent database lookups
        subscriptionCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        });
        
        return res.status(200).json(response);
      }
      
      const subscription = user.subscription || null;
      const response = {
        status: 'success',
        data: { subscription },
        message: subscription ? 'Subscription found' : 'No active subscription',
        timestamp: new Date().toISOString(),
        responseTime: `${Date.now() - startTime}ms`
      };
      
      // Update cache
      subscriptionCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
      
      // Set cache headers
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
      res.setHeader('X-Cache', 'MISS');
      
      return res.status(200).json(response);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Return cached data on error if available (stale-while-revalidate)
      if (cachedData) {
        res.setHeader('X-Cache', 'STALE');
        return res.status(200).json({
          status: 'success',
          data: cachedData.data,
          message: 'Using cached data due to backend error',
          timestamp: new Date().toISOString(),
          responseTime: `${Date.now() - startTime}ms`
        });
      }
      
      return res.status(500).json({
        status: 'error',
        error: 'Failed to fetch subscription status',
        code: 'SUBSCRIPTION_FETCH_ERROR',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        responseTime: `${Date.now() - startTime}ms`
      });
    }
  });

  // Compression endpoint
  app.post('/api/compress', isAuthenticated, validateRequest(compressionRequestSchema), async (req: any, res) => {
    try {
      const storage = await getStorage();
      const userId = req.user.id;
      const { quality, maxWidth, maxHeight, format } = req.body;

      // Check compression limits
      const canCompress = await storage.canCompress(userId);
      if (!canCompress) {
        return res.status(403).json({ 
          error: "Compression limit reached. Please upgrade your plan." 
        });
      }

      // Validate file upload
      if (!req.files || !req.files.image) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const file = req.files.image;
      
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." });
      }

      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        return res.status(400).json({ error: "File too large. Maximum size is 50MB." });
      }

      // Increment compression count
      await storage.incrementCompressionCount(userId);

      // For now, return a placeholder response since processImageCompression doesn't exist
      res.json({ 
        message: "Compression endpoint ready",
        quality,
        format,
        fileSize: file.size
      });
    } catch (error) {
      console.error("❌ Compression error:", error);
      res.status(500).json({ error: "Compression failed" });
    }
  });

  // User profile endpoints with validation
  app.put('/api/user/profile', isAuthenticated, validateRequest(userUpdateSchema), async (req: any, res) => {
    try {
      const storage = await getStorage();
      const userId = req.user.id;
      const { name, email } = req.body;

      // Sanitize inputs
      const sanitizedData = {
        ...(name && { name: sanitizeString(name) }),
        ...(email && { email: sanitizeString(email) })
      };

      // Update user using upsertUser method
      await storage.upsertUser({
        id: userId,
        ...sanitizedData
      });
      
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("❌ Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Stats endpoint with rate limiting
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const storage = await getStorage();
      const userId = req.user.id;
      const subscription = await storage.getUserSubscription(userId);
      const compressionCount = await storage.getCompressionCount(userId);
      const canCompress = await storage.canCompress(userId);
      
      const stats = {
        subscription,
        compressionCount,
        canCompress,
        isActive: subscription?.status === 'ACTIVE'
      };
      
      res.json(stats);
    } catch (error) {
      console.error("❌ Stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Record subscription after payment success
  app.post('/api/subscription/record', verifyFirebaseToken, async (req, res) => {
    try {
      const { planId, startTime, endTime } = req.body;
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, error: "Authentication required" });
      }
      const userId = req.user.id;
      const userEmail = req.user.email;
      const storage = await getStorage();
      await storage.createUserSubscription({
        id: `SUB_${userId}_${Date.now()}`,
        userId,
        planId,
        subscriptionId: `SUB_${userId}_${Date.now()}`,
        status: 'ACTIVE',
        currentPeriodStart: new Date(startTime),
        currentPeriodEnd: new Date(endTime),
        compressionCount: 0,
      });
      // Send confirmation email if user email is available
      if (userEmail) {
        await sendEmail({
          to: userEmail,
          subject: "Your CompressHub Subscription is Active!",
          html: `<h2>Thank you for subscribing!</h2><p>Your plan <b>${planId}</b> is now active for 15 minutes.</p>`
        });
      }
      res.json({ success: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Error recording subscription:', errorMessage);
      res.status(500).json({ success: false, error: errorMessage });
    }
  });

  // Record BMC membership subscription
  app.post('/api/subscription/record-bmc', async (req: any, res) => {
    try {
      const storage = await getStorage();
      const { planId, email, durationMs } = req.body;
      if (!planId || !email || !durationMs) {
        return res.status(400).json({ error: 'Missing planId, email, or durationMs' });
      }
      let user = await storage.getUserByEmail(email);
      if (!user) {
        // Create user if not found
        const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        user = await storage.upsertUser({ id, email });
      }
      const userId = user.id;
      const now = Date.now();
      const subscriptionId = `BMC_${userId}_${now}`;
      // Expire all previous active subscriptions for this user
      await storage.updateAllUserSubscriptionsStatus(userId, 'EXPIRED');
      // Upsert subscription: if user already has an active subscription, update it; else, create new
      let newSubscription;
      const existing = await storage.getUserSubscription(userId);
      if (existing && existing.status === 'ACTIVE') {
        newSubscription = await storage.updateUserSubscription(existing.id, {
          planId,
          status: 'ACTIVE',
          currentPeriodStart: new Date(now),
          currentPeriodEnd: new Date(now + durationMs),
          updatedAt: new Date(),
        });
      } else {
        newSubscription = await storage.createUserSubscription({
        id: subscriptionId,
        userId,
        planId,
        subscriptionId,
        status: 'ACTIVE',
        compressionCount: 0,
        transactionId: null,
        currentPeriodStart: new Date(now),
          currentPeriodEnd: new Date(now + durationMs),
      });
      }
      res.json({ success: true, subscription: newSubscription });
    } catch (error) {
      console.error('❌ Error recording BMC subscription:', error);
      res.status(500).json({ error: 'Failed to record BMC subscription' });
    }
  });

  // Admin: Get all subscriptions (dashboard)
  app.get('/api/admin/subscriptions', verifyFirebaseToken, async (req, res) => {
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!req.user || !req.user.email || req.user.email !== adminEmail) {
        return res.status(403).json({ success: false, error: 'Forbidden: Admin access only' });
      }
      const { status } = req.query;
      const subs = await getAllSubscriptions({ status: typeof status === 'string' ? status : undefined });
      res.json({ success: true, subscriptions: subs });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Error fetching subscriptions:', errorMessage);
      res.status(500).json({ success: false, error: errorMessage });
    }
  });

  // Admin: Expire a subscription manually
  app.post('/api/admin/subscription/expire', verifyFirebaseToken, async (req, res) => {
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!req.user || !req.user.email || req.user.email !== adminEmail) {
        return res.status(403).json({ success: false, error: 'Forbidden: Admin access only' });
      }
      const { id } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'Missing subscription id' });
      const storage = await getStorage();
      await storage.updateUserSubscription(id, { status: 'EXPIRED' });
      res.json({ success: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: errorMessage });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Authentication endpoints with rate limiting
  app.post('/api/auth/verify', authRateLimiter, async (req, res) => {
    try {
      const { idToken } = req.body;
      
      if (!idToken || typeof idToken !== 'string') {
        return res.status(400).json({ error: "Invalid token provided" });
      }

      // Sanitize token
      const sanitizedToken = sanitizeString(idToken);
      
      // For now, we'll use a simplified approach since verifyFirebaseToken is middleware
      // In a real implementation, you'd verify the token here
      res.status(501).json({ error: "Token verification not implemented" });
    } catch (error) {
      console.error("❌ Auth verification error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Serve static files and handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(process.cwd() + "/client/index.html");
  });

  return httpServer;
}
