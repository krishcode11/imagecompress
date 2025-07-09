import { Request, Response } from 'express';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { getStorage as getDbStorage } from '../storage';

// Initialize Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const bucketName = 'img_compress';
const bucket = storage.bucket(bucketName);

// Function to upload file to GCS
const uploadFileToGCS = (fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: contentType,
      },
      resumable: false
    });

    blobStream.on('error', (error) => {
      console.error('Error uploading to GCS:', error);
      reject(error);
    });

    blobStream.on('finish', () => {
      // Make the file public
      blob.makePublic()
        .then(() => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve(publicUrl);
        })
        .catch(reject);
    });

    blobStream.end(fileBuffer);
  });
};

export const compressImage = async (req: any, res: Response) => {
  try {
    const { quality = 80, maxWidth, maxHeight, format = 'jpeg' } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check user's subscription status
    const dbStorage = await getDbStorage();
    const canCompress = await dbStorage.canCompress(req.user.id);
    
    if (!canCompress) {
      return res.status(403).json({
        error: 'You have reached your compression limit for the current billing period. Please upgrade your plan.'
      });
    }

    // Process image with sharp
    let image = sharp(file.buffer);
    
    // Resize if dimensions are provided
    if (maxWidth || maxHeight) {
      image = image.resize({
        width: maxWidth ? parseInt(maxWidth) : undefined,
        height: maxHeight ? parseInt(maxHeight) : undefined,
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert to desired format and compress
    let outputBuffer: Buffer;
    const outputOptions = {
      quality: parseInt(quality),
      progressive: true,
      optimizeScans: true
    };

    switch (format.toLowerCase()) {
      case 'png':
        outputBuffer = await image.png(outputOptions).toBuffer();
        break;
      case 'webp':
        outputBuffer = await image.webp(outputOptions).toBuffer();
        break;
      case 'jpeg':
      default:
        outputBuffer = await image.jpeg(outputOptions).toBuffer();
    }

    // Generate a unique filename
    const fileExtension = format.toLowerCase();
    const fileName = `compressed/${uuidv4()}.${fileExtension}`;

    // Upload to Google Cloud Storage
    const publicUrl = await uploadFileToGCS(
      outputBuffer,
      fileName,
      `image/${fileExtension}`
    );
    
    // Increment user's compression count
    await dbStorage.incrementCompressionCount(req.user.id);

    res.json({
      success: true,
      message: 'Image compressed successfully',
      url: publicUrl,
      format,
      size: outputBuffer.length,
      originalSize: file.size,
      compressionRatio: (1 - (outputBuffer.length / file.size)) * 100
    });

  } catch (error: any) {
    console.error('Error compressing image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to compress image';
    res.status(500).json({ error: errorMessage, details: error.message });
  }
};

export const getImageStats = async (req: any, res: Response) => {
  try {
    const dbStorage = await getDbStorage();
    const stats = await dbStorage.getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error('Error getting image stats:', error);
    res.status(500).json({ error: 'Failed to get image stats' });
  }
};
