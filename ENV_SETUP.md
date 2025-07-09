# 🚀 Environment Setup Guide

This guide will help you set up your ImageCompressor application with all the necessary environment variables.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A database (PostgreSQL recommended)
- Firebase project (for authentication)
- CoinPayments account (for payments - optional in development)

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

### 🔐 Required Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/imagecompressor"

# Session Security
SESSION_SECRET="your-super-secret-session-key-here"

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 🔥 Firebase Authentication (Required)

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-client-id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"
```

### 💰 CoinPayments (Optional - for production payments)

```bash
# CoinPayments Configuration
COINPAYMENTS_PUBLIC_KEY="your-coinpayments-public-key"
COINPAYMENTS_PRIVATE_KEY="your-coinpayments-private-key"
```

## 🛠️ Setup Steps

### 1. Database Setup

#### Option A: Supabase (Recommended - Free & Easy)
1. **Go to [Supabase](https://supabase.com/)**
2. **Sign up for a free account**
3. **Create a new project**
4. **Go to Settings > Database**
5. **Copy the connection string** (looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
6. **Add to your `.env` file:**
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

#### Option B: Local PostgreSQL
1. **Install PostgreSQL** (if not already installed)
2. **Create a database:**
   ```sql
   CREATE DATABASE imagecompressor;
   ```
3. **Update DATABASE_URL** in your `.env` file with your database credentials

### 2. Firebase Setup

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Authentication** with Google provider
4. **Go to Project Settings > Service Accounts**
5. **Generate new private key** - this downloads a JSON file
6. **Copy the values** from the JSON file to your `.env` file

### 3. CoinPayments Setup (Optional)

1. **Sign up at [CoinPayments](https://www.coinpayments.net/)**
2. **Get your API keys** from Account > API Keys
3. **Add the keys** to your `.env` file

## 🚀 Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will start with:
- ✅ **Mock payment functionality** (no real payments)
- ✅ **Auto-activated subscriptions** in development
- ✅ **Full feature access** for testing

### Production Mode

```bash
# Set NODE_ENV to production
NODE_ENV=production npm start
```

## 🔍 Verification

### Check Payment Service Status

Visit: `http://localhost:3000/api/payment/status`

**Development Mode Response:**
```json
{
  "configured": false,
  "development": true,
  "message": "Running in development mode with mock functionality",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Production Mode Response (with credentials):**
```json
{
  "configured": true,
  "development": false,
  "message": "CoinPayments fully configured",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Subscription Flow

1. **Visit:** `http://localhost:3000/subscription`
2. **Select a plan** and click "Get [Plan Name]"
3. **In development mode:** Subscription will be auto-activated
4. **In production mode:** You'll be redirected to CoinPayments

## 🛡️ Security Notes

### Development Mode
- ✅ Mock payments are safe
- ✅ No real money involved
- ✅ Auto-activated subscriptions for testing
- ✅ All features work normally

### Production Mode
- 🔒 **REQUIRES** all environment variables
- 🔒 **REQUIRES** real CoinPayments credentials
- 🔒 **REQUIRES** proper database setup
- 🔒 **REQUIRES** Firebase authentication

## 🐛 Troubleshooting

### Common Issues

1. **"CoinPayments credentials not configured"**
   - ✅ **Normal in development mode**
   - ❌ **Fix in production:** Add CoinPayments credentials

2. **"Database connection failed"**
   - Check your `DATABASE_URL`
   - Ensure PostgreSQL is running
   - Verify database exists

3. **"Firebase authentication failed"**
   - Check Firebase credentials in `.env`
   - Verify service account JSON values
   - Ensure Firebase project is active

4. **"Session secret not configured"**
   - Add `SESSION_SECRET` to your `.env` file
   - Use a strong, random string

### Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Payments | Mock | Real (CoinPayments) |
| Subscriptions | Auto-activated | Manual activation |
| Database | Local/Dev | Production DB |
| Authentication | Firebase | Firebase |
| Security | Relaxed | Strict |

## 📞 Support

If you encounter issues:

1. **Check the console logs** for detailed error messages
2. **Verify all environment variables** are set correctly
3. **Test the payment status endpoint** to verify configuration
4. **Review the troubleshooting section** above

## 🎯 Next Steps

Once your environment is configured:

1. **Test the subscription flow** in development mode
2. **Verify all pages load correctly**
3. **Test authentication flow**
4. **Deploy to production** when ready

---

**Happy coding! 🚀** 