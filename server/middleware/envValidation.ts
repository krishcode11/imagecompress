import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.string().transform(Number),
  SESSION_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  ADMIN_EMAIL: z.string().email(),
  VITE_API_URL: z.string().url(),
  GOOGLE_CLOUD_PROJECT_ID: z.string(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string(),
  GOOGLE_CLOUD_STORAGE_BUCKET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  MAX_FILE_SIZE: z.string().transform(Number),
  ALLOWED_ORIGINS: z.string().transform(str => str.split(',')),
});

export const validateEnv = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Missing or invalid environment variables:');
      error.errors.forEach(err => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
  }
};
