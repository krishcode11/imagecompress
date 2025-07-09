import multer from 'multer';
import { Request } from 'express';

// Allowed image types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Use memory storage to access the file buffer for validation
export const storage = multer.memoryStorage();

// Basic, synchronous file filter for multer
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
});
