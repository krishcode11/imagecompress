import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Download, Zap, Settings } from 'lucide-react';
import { CompressedFile } from '@/types/file';
import { formatFileSize } from '@/lib/image-compression';

interface QualityPreviewProps {
  file: CompressedFile;
  originalPreview: string;
  compressedPreview?: string;
  compressionRatio?: number;
  onQualityChange?: (quality: number) => void;
  onRecompress?: () => void;
  isCompressing?: boolean;
}

export function QualityPreview({
  file,
  originalPreview,
  compressedPreview,
  compressionRatio,
  onQualityChange,
  onRecompress,
  isCompressing = false
}: QualityPreviewProps) {
  const [showComparison, setShowComparison] = useState(true);
  const [quality, setQuality] = useState([80]);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleQualityChange = (value: number[]) => {
    setQuality(value);
    onQualityChange?.(value[0]);
  };

  const getQualityAssessment = (ratio?: number) => {
    if (!ratio) return { label: 'Unknown', color: 'bg-gray-500' };
    
    if (ratio > 5) return { label: 'Excellent', color: 'bg-emerald-500' };
    if (ratio > 3) return { label: 'Very Good', color: 'bg-blue-500' };
    if (ratio > 2) return { label: 'Good', color: 'bg-yellow-500' };
    if (ratio > 1.5) return { label: 'Fair', color: 'bg-orange-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const assessment = getQualityAssessment(compressionRatio);

  return (
    <Card className="p-6 bg-white shadow-sm border border-slate-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Quality Assessment</h3>
            <p className="text-sm text-slate-600">{file.file.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            {compressionRatio && (
              <Badge className={`${assessment.color} text-white`}>
                {assessment.label}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showComparison ? 'Hide' : 'Show'} Comparison
            </Button>
          </div>
        </div>

        {/* Quality Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Compression Quality</label>
            <span className="text-sm font-medium text-slate-900">{quality[0]}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-500 w-16">Smaller</span>
            <Slider
              value={quality}
              onValueChange={handleQualityChange}
              max={100}
              min={10}
              step={5}
              className="flex-1"
            />
            <span className="text-xs text-slate-500 w-16">Better</span>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={onRecompress}
              disabled={isCompressing}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isCompressing ? 'Recompressing...' : 'Apply Quality'}
            </Button>
          </div>
        </div>

        {/* Image Comparison */}
        {showComparison && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Original</h4>
                <div className="relative bg-slate-100 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={originalPreview}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {formatFileSize(file.originalSize)}
                  </div>
                </div>
              </div>

              {/* Compressed */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Compressed</h4>
                <div className="relative bg-slate-100 rounded-lg overflow-hidden aspect-square">
                  {compressedPreview ? (
                    <>
                      <img
                        src={compressedPreview}
                        alt="Compressed"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {formatFileSize(file.compressedSize || 0)}
                      </div>
                      {file.savings && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                          -{file.savings}%
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <Settings className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Awaiting compression</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Comparison */}
            {compressedPreview && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Interactive Comparison</h4>
                <div 
                  className="relative bg-slate-100 rounded-lg overflow-hidden aspect-video cursor-pointer"
                  onMouseEnter={() => setIsMouseOver(true)}
                  onMouseLeave={() => setIsMouseOver(false)}
                >
                  <img
                    src={isMouseOver ? originalPreview : compressedPreview}
                    alt="Comparison"
                    className="w-full h-full object-cover transition-all duration-200"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 text-white px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">
                        {isMouseOver ? 'Original' : 'Compressed'}
                      </p>
                      <p className="text-xs opacity-75">
                        Hover to compare
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compression Stats */}
        {compressionRatio && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {compressionRatio.toFixed(1)}x
              </div>
              <div className="text-xs text-slate-600">Compression Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {file.savings || 0}%
              </div>
              <div className="text-xs text-slate-600">Size Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {quality[0]}%
              </div>
              <div className="text-xs text-slate-600">Quality Level</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}