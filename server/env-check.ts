const requiredEnv = [
  "DATABASE_URL",
  "SESSION_SECRET",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "COINPAYMENTS_PUBLIC_KEY",
  "COINPAYMENTS_PRIVATE_KEY",
  "ADMIN_EMAIL"
];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error("❌ Missing required environment variables:", missing.join(", "));
  process.exit(1);
} 