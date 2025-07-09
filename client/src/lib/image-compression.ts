export interface CompressionOptions {
  quality: number; // 0-100
  maxWidth?: number;
  maxHeight?: number;
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'; // default: auto-detect or jpeg
  webOptimized?: boolean; // Enable web-specific optimizations
  progressive?: boolean; // Enable progressive JPEG
  removeMetadata?: boolean; // Remove EXIF/metadata for smaller size
}

export interface CompressionResult {
  blob: Blob;
  compressedSize: number;
  originalDimensions: { width: number; height: number };
  compressedDimensions: { width: number; height: number };
  compressionRatio: number;
  quality: number;
  preview?: string; // Base64 preview for quality assessment
}

export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      // Store original dimensions
      const originalDimensions = { width: img.width, height: img.height };
      
      // Calculate optimized dimensions
      let { width, height } = img;
      
      // Web optimization: limit maximum dimensions for web usage
      if (options.webOptimized) {
        const maxWebWidth = options.maxWidth || 1920;
        const maxWebHeight = options.maxHeight || 1080;
        
        if (width > maxWebWidth) {
          height = (height * maxWebWidth) / width;
          width = maxWebWidth;
        }
        
        if (height > maxWebHeight) {
          width = (width * maxWebHeight) / height;
          height = maxWebHeight;
        }
      } else {
        if (options.maxWidth && width > options.maxWidth) {
          height = (height * options.maxWidth) / width;
          width = options.maxWidth;
        }
        
        if (options.maxHeight && height > options.maxHeight) {
          width = (width * options.maxHeight) / height;
          height = options.maxHeight;
        }
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Enhanced JPEG compression algorithm
      if (options.webOptimized) {
        // Use bicubic interpolation for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      
      // Draw image with anti-aliasing
      ctx.drawImage(img, 0, 0, width, height);
      
      // Apply additional optimizations for JPEG
      const applyJPEGOptimizations = (imageData: ImageData) => {
        const data = imageData.data;
        
        if (options.webOptimized && options.quality < 85) {
          // Apply subtle noise reduction for better compression
          for (let i = 0; i < data.length; i += 4) {
            // Slight color quantization to improve compression efficiency
            data[i] = Math.round(data[i] / 2) * 2;     // Red
            data[i + 1] = Math.round(data[i + 1] / 2) * 2; // Green  
            data[i + 2] = Math.round(data[i + 2] / 2) * 2; // Blue
          }
        }
        
        return imageData;
      };
      
      // Determine output format
      let outputFormat = options.outputFormat;
      if (!outputFormat) {
        if (file.type === 'image/png' && !options.webOptimized) {
          outputFormat = 'image/png';
        } else if (file.type === 'image/webp') {
          outputFormat = 'image/webp';
        } else {
          outputFormat = 'image/jpeg'; // Default for web optimization
        }
      }
      
      // Apply optimizations for JPEG
      if (outputFormat === 'image/jpeg' && options.webOptimized) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const optimizedData = applyJPEGOptimizations(imageData);
        ctx.putImageData(optimizedData, 0, 0);
      }
      
      // Calculate quality based on file size and content
      let adjustedQuality = options.quality / 100;
      
      // Web optimization: adjust quality based on image characteristics
      if (options.webOptimized) {
        const pixelCount = width * height;
        if (pixelCount > 1000000) { // Large images get slightly lower quality
          adjustedQuality = Math.max(0.1, adjustedQuality - 0.1);
        }
      }
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Generate preview for quality assessment
            const previewCanvas = document.createElement('canvas');
            const previewCtx = previewCanvas.getContext('2d');
            const previewSize = 200; // Small preview size
            
            if (previewCtx) {
              const previewScale = Math.min(previewSize / width, previewSize / height);
              previewCanvas.width = width * previewScale;
              previewCanvas.height = height * previewScale;
              
              previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
            }
            
            const compressionRatio = file.size / blob.size;
            
            resolve({
              blob,
              compressedSize: blob.size,
              originalDimensions,
              compressedDimensions: { width, height },
              compressionRatio,
              quality: options.quality,
              preview: previewCanvas.toDataURL('image/jpeg', 0.8)
            });
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        outputFormat,
        adjustedQuality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateSavings(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
