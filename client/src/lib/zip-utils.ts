import JSZip from 'jszip';
import { CompressedFile } from '@/types/file';

export async function createZipFromFiles(files: CompressedFile[]): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    if (file.status === 'compressed' && file.compressedBlob) {
      // Create unique filename to avoid conflicts
      const filename = `compressed_${file.file.name}`;
      zip.file(filename, file.compressedBlob);
    }
  }
  
  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
