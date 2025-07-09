export interface CompressedFile {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  compressedBlob?: Blob;
  preview: string;
  compressedPreview?: string;
  status: 'uploading' | 'ready' | 'compressing' | 'compressed' | 'error';
  progress: number;
  savings?: number;
  error?: string;
  compressionRatio?: number;
  originalDimensions?: { width: number; height: number };
  compressedDimensions?: { width: number; height: number };
  quality?: number;
}

export interface CompressionStats {
  totalFiles: number;
  originalSize: number;
  compressedSize: number;
  totalSavings: number;
}
