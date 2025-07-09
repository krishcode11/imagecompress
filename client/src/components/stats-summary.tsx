import { CompressionStats } from '@/types/file';
import { formatFileSize } from '@/lib/image-compression';

interface StatsSummaryProps {
  stats: CompressionStats;
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Compression Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{stats.totalFiles}</div>
          <div className="text-sm text-slate-600">Files Processed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{formatFileSize(stats.originalSize)}</div>
          <div className="text-sm text-slate-600">Original Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{formatFileSize(stats.compressedSize)}</div>
          <div className="text-sm text-slate-600">Compressed Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{stats.totalSavings}%</div>
          <div className="text-sm text-slate-600">Space Saved</div>
        </div>
      </div>
    </div>
  );
}
