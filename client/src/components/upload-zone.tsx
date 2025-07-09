import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FolderOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UploadZoneProps {
  onFilesUploaded: (files: File[]) => void;
  disabled?: boolean;
  maxFileSize?: number; // in bytes, default 10MB
}

export function UploadZone({ onFilesUploaded, disabled, maxFileSize = 10 * 1024 * 1024 }: UploadZoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        const error = file.errors[0];
        if (error.code === 'file-too-large') {
          return `${file.file.name}: File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`;
        }
        if (error.code === 'file-invalid-type') {
          return `${file.file.name}: Invalid file type. Please upload image files only`;
        }
        return `${file.file.name}: ${error.message}`;
      });
      
      toast({
        title: "Upload errors",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    // Filter and validate accepted files
    const validImageFiles = acceptedFiles.filter(file => {
      // Double-check file type
      if (!file.type.startsWith('image/')) {
        return false;
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    if (validImageFiles.length > 0) {
      onFilesUploaded(validImageFiles);
    }
  }, [onFilesUploaded, maxFileSize, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico']
    },
    multiple: true,
    disabled,
    maxSize: maxFileSize
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 cursor-pointer group
        ${isDragActive 
          ? 'border-primary bg-blue-50' 
          : 'border-slate-300 hover:border-primary hover:bg-slate-50'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <CloudUpload className="w-8 h-8 text-slate-400 group-hover:text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {isDragActive ? 'Drop your image files here' : 'Drop your image files here'}
          </h3>
          <p className="text-slate-600 mb-4">or click to browse and select multiple files</p>
          <Button 
            className="inline-flex items-center"
            disabled={disabled}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>
        <div className="text-sm text-slate-500 space-y-1">
          <p>Supports all image formats: JPEG, PNG, GIF, WebP, BMP, SVG, TIFF, ICO</p>
          <p>Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB per file</p>
        </div>
      </div>
    </div>
  );
}
