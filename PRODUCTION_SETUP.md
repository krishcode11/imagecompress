# 🚀 Production Setup Guide - Live Subscription System

This guide will help you set up a **production-ready subscription system** with real API data and CoinPayment integration.

## 📋 Prerequisites

Before starting, ensure you have:
- A PostgreSQL database (Neon, Supabase, or self-hosted)
- CoinPayments account with API credentials
- Firebase project for authentication
- Domain name for your application

## 🔧 Step 1: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# =============================================================================
# 🔐 REQUIRED - Database Configuration
# =============================================================================
DATABASE_URL="postgresql://username:password@host:port/database"

# =============================================================================
# 🔐 REQUIRED - Session Security
# =============================================================================
SESSION_SECRET="your-super-secret-session-key-here-make-it-long-and-random"

# =============================================================================
# 🔐 REQUIRED - Firebase Authentication
# =============================================================================
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-client-id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"

# =============================================================================
# 💰 REQUIRED - CoinPayments (for real payments)
# =============================================================================
COINPAYMENTS_PUBLIC_KEY="your-coinpayments-public-key"
COINPAYMENTS_PRIVATE_KEY="your-coinpayments-private-key"

# =============================================================================
# ⚙️ OPTIONAL - Server Configuration
# =============================================================================
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
BASE_URL=https://yourdomain.com
```

## 🗄️ Step 2: Database Setup

### Option A: Supabase Database (Recommended)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Update your `.env` file with the connection string

### Option B: Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account  OVUARhhkrzyJCr5R
2. Create a new project
3. Copy the connection string from the dashboard
4. Update your `.env` file with the connection string

### Database Schema

The application will automatically create the required tables when it starts. The schema includes:

- `users` - User accounts and profiles
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - User subscription records
- `subscription_transactions` - Payment transaction history

## 🔥 Step 3: Firebase Authentication Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the values to your `.env` file

## 💰 Step 4: CoinPayments Setup

1. Go to [CoinPayments](https://www.coinpayments.net) and create an account
2. Go to Account > API Keys
3. Create a new API key with the following permissions:
   - `create_transaction`
   - `get_tx_info`
   - `get_tx_ids`
4. Copy the public and private keys to your `.env` file

## 🚀 Step 5: Application Deployment

### Local Testing

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The server will start on port 5000 and automatically:
   - Initialize the database schema
   - Create subscription plans
   - Set up API routes

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## ✅ Step 6: Verification

### Test the API Endpoints

1. **Subscription Plans**: `GET /api/subscription/plans`
   - Should return all available subscription plans
   - Plans are automatically created from `init-plans.ts`

2. **Payment Status**: `GET /api/payment/status`
   - Should return CoinPayments configuration status

3. **Create Subscription**: `POST /api/subscription/create`
   - Should create a real CoinPayments transaction
   - Returns checkout URL for payment

### Test the Payment Flow

1. Navigate to `/subscription`
2. Select a plan and click "Get Started"
3. You should be redirected to CoinPayments checkout
4. Complete the payment with cryptocurrency
5. You should be redirected to `/payment/success`
6. Your subscription should be activated

## 🔒 Step 7: Security Verification

### Environment Variables
- ✅ All required environment variables are set
- ✅ No sensitive data in code
- ✅ Strong session secret

### API Security
- ✅ Helmet security headers enabled
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation with Zod

### Payment Security
- ✅ CoinPayments HMAC verification
- ✅ Webhook signature validation
- ✅ Transaction status verification

## 📊 Step 8: Monitoring

### Logs to Monitor

1. **Server Startup**:
   ```
   ✅ Database connection successful
   ✅ Subscription plans initialized successfully
   ✅ CoinPayments service initialized successfully
   ```

2. **Payment Processing**:
   ```
   📋 Fetching subscription plans...
   🔧 CoinPayments status: { configured: true, development: false }
   ✅ Subscription activated: SUB_userId_timestamp
   ```

3. **Error Handling**:
   ```
   ❌ Error fetching subscription plans: [error details]
   ❌ Payment creation error: [error details]
   ```

### Health Check Endpoints

- `GET /api/payment/status` - Payment service status
- `GET /api/subscription/plans` - Subscription plans availability
- `GET /api/subscription/status` - User subscription status (authenticated)

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify network connectivity

2. **CoinPayments Not Working**
   - Verify API keys are correct
   - Check API key permissions
   - Ensure account is verified

3. **Subscription Plans Not Loading**
   - Check server logs for initialization errors
   - Verify database schema is created
   - Check API endpoint accessibility

4. **Payment Redirect Issues**
   - Verify BASE_URL is set correctly
   - Check CORS configuration
   - Ensure return URLs are accessible

### Debug Mode

To enable debug logging, set:
```bash
NODE_ENV=development
```

This will provide detailed logs for troubleshooting.

## 📈 Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and schema created
- [ ] Firebase authentication working
- [ ] CoinPayments integration tested
- [ ] Subscription plans loading from API
- [ ] Payment flow working end-to-end
- [ ] Success/failure pages accessible
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] Logs being monitored
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Backup strategy in place

## 🎯 Features Implemented

### ✅ Live API Integration
- Real subscription plans from database
- Dynamic plan fetching via `/api/subscription/plans`
- No mock data or fallbacks

### ✅ Real Payment Processing
- CoinPayments integration for cryptocurrency payments
- Live transaction creation and verification
- Webhook handling for payment status updates

### ✅ Complete Payment Flow
- "Get Started" button initiates real payment
- Redirect to CoinPayments checkout
- Success/failure page handling
- Subscription activation on successful payment

### ✅ Production-Ready Security
- Environment variable validation
- Database connection requirements
- Authentication protection
- Input validation and sanitization
- Rate limiting and CORS protection

### ✅ Time-Based Access Control
- Subscription expiration tracking
- Feature access based on plan limits
- Compression count tracking
- Automatic plan enforcement

## 🚀 Ready for Production

Your subscription system is now **production-ready** with:
- Real API data from database
- Live CoinPayments integration
- Complete payment flow
- Security best practices
- Error handling and monitoring

The system will automatically:
1. Initialize subscription plans on startup
2. Handle real cryptocurrency payments
3. Activate subscriptions on successful payment
4. Enforce plan limits and access control
5. Track usage and expiration

**You can now deploy this to production and start accepting real payments!** 🎉 