import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CompressedFile } from '@/types/file';
import { FileCard } from './file-card';
import { createZipFromFiles, downloadBlob } from '@/lib/zip-utils';

interface FileGridProps {
  files: CompressedFile[];
  onDownloadAll: () => void;
  canDownloadAll: boolean;
}

export function FileGrid({ files, onDownloadAll, canDownloadAll }: FileGridProps) {
  const handleDownloadAll = async () => {
    const compressedFiles = files.filter(f => f.status === 'compressed');
    if (compressedFiles.length > 0) {
      try {
        const zipBlob = await createZipFromFiles(compressedFiles);
        downloadBlob(zipBlob, 'compressed_images.zip');
      } catch (error) {
        console.error('Failed to create ZIP:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Your Images</h3>
        {canDownloadAll && (
          <Button 
            onClick={handleDownloadAll}
            className="bg-accent hover:bg-violet-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All as ZIP
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
