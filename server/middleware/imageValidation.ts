import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';

const MAX_DIMENSIONS = 4000;

export const validateImage = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new Error('No file uploaded.'));
  }

  try {
    const metadata = await sharp(req.file.buffer).metadata();

    // Check dimensions
    if (metadata.width && metadata.height) {
      if (metadata.width > MAX_DIMENSIONS || metadata.height > MAX_DIMENSIONS) {
        return next(new Error('Image dimensions too large. Maximum size is 4000x4000 pixels'));
      }
    }

    // Check file format matches metadata
    if (metadata.format) {
      const format = metadata.format.toLowerCase();
      if (!['jpeg', 'png', 'webp', 'gif'].includes(format)) {
        return next(new Error('Invalid image format'));
      }
    }

    // Check for potential malicious content (e.g., image bombs)
    if (metadata.pages && metadata.pages > 1) {
      return next(new Error('Animated images are not allowed'));
    }

    // If all checks pass, proceed to the next middleware
    next();
  } catch (error) {
    return next(new Error('Invalid or corrupt image file.'));
  }
};
