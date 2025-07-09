import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, ArrowDown } from 'lucide-react';
import { CompressedFile } from '@/types/file';
import { formatFileSize } from '@/lib/image-compression';
import { downloadBlob } from '@/lib/zip-utils';

interface FileCardProps {
  file: CompressedFile;
}

export function FileCard({ file }: FileCardProps) {
  const handleDownload = () => {
    if (file.compressedBlob) {
      downloadBlob(file.compressedBlob, `compressed_${file.file.name}`);
    }
  };

  const getStatusColor = () => {
    switch (file.status) {
      case 'uploading':
      case 'compressing':
        return 'bg-amber-500';
      case 'compressed':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  };

  const getStatusText = () => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading';
      case 'compressing':
        return 'Compressing';
      case 'compressed':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="relative">
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
          {file.file.name}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-600">
            <div className="font-medium text-slate-900 truncate">{file.file.name}</div>
            <div className="text-xs">Original: {formatFileSize(file.originalSize)}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-xs text-slate-600">{getStatusText()}</span>
          </div>
        </div>
        
        {(file.status === 'compressing' || file.status === 'uploading') && (
          <Progress value={file.progress} className="mb-3" />
        )}
        
        {file.status === 'compressed' && (
          <>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-3">
              <div>
                <div className="font-medium text-slate-900">Before</div>
                <div>{formatFileSize(file.originalSize)}</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">After</div>
                <div>{formatFileSize(file.compressedSize || 0)}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-secondary">
                <ArrowDown className="w-4 h-4 inline mr-1" />
                {file.savings}% smaller
              </div>
              <Button
                onClick={handleDownload}
                size="sm"
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </>
        )}
        
        {file.status === 'error' && (
          <div className="text-sm text-red-600 mt-2">
            {file.error || 'An error occurred during compression'}
          </div>
        )}
      </div>
    </div>
  );
}
