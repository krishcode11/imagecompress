import React, { useState } from "react";
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
import BannerAd from "./BannerAd";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Combine, Trash2, Clock, Zap } from 'lucide-react';
import { SubscriptionPlan } from '../../../shared/plans';

interface QueueProgress {
  current: number;
  total: number;
  completed: number;
  failed: number;
  processing: boolean;
}

interface CompressionControlsProps {
  onCompress: (quality: number) => void;
  onClear: () => void;
  isCompressing: boolean;
  filesCount: number;
  queueProgress?: QueueProgress;
  plan: SubscriptionPlan;
}

export default function CompressionControls({ 
  onCompress, 
  onClear, 
  isCompressing, 
  filesCount,
  queueProgress,
  plan
}: CompressionControlsProps) {
  const { data: subscriptionData } = useSubscriptionQuery();
  const isSubscribed = subscriptionData?.subscription?.status === 'ACTIVE';
  const minQuality = 60;
  const maxQuality = isSubscribed ? 100 : 80;
  const defaultQuality = isSubscribed ? 90 : 70;
  const [quality, setQuality] = useState<number>(defaultQuality);

  const handleCompress = () => {
    onCompress(quality);
  };

  const getQualityDescription = (quality: number) => {
    if (quality >= 90) return "Maximum quality, larger files";
    if (quality >= 80) return "High quality, good for printing";
    if (quality >= 70) return "Good quality, web optimized";
    if (quality >= 50) return "Medium quality, smaller files";
    return "Low quality, smallest files";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Advanced Compression Settings</h3>
        {queueProgress?.processing && (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Processing Queue
          </Badge>
        )}
      </div>

      {/* Show plan features */}
      <div className="mb-4">
        <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700">
          Plan: {plan.name}
        </Badge>
        <ul className="text-xs text-slate-500 mt-2">
          {plan.features.map((feature, i) => (
            <li key={i}>• {feature}</li>
          ))}
        </ul>
      </div>

      {/* Queue Progress */}
      {queueProgress && queueProgress.processing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Compression Progress</span>
            <span className="text-sm text-blue-700">
              {queueProgress.current} of {queueProgress.total} processing
            </span>
          </div>
          <Progress 
            value={(queueProgress.current / Math.max(queueProgress.total, 1)) * 100} 
            className="h-2 mb-2"
          />
          <div className="flex justify-between text-xs text-blue-600">
            <span>Queue: {queueProgress.total - queueProgress.current} remaining</span>
            <span>Active: {queueProgress.current} files</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Quality Settings */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Compression Quality</label>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Web Optimized
              </Badge>
              <span className="text-sm font-medium text-slate-900">{quality}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-2">
            <span className="text-sm text-slate-600 w-16">Smaller</span>
            <div className="flex-1">
              <Slider
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                max={maxQuality}
                min={minQuality}
                step={5}
                className="w-full"
              />
            </div>
            <span className="text-sm text-slate-600 w-16">Better</span>
          </div>
          
          <p className="text-xs text-slate-500 text-center">
            {getQualityDescription(quality)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            {filesCount > 0 ? (
              <span>{filesCount} files ready • Advanced JPEG algorithm</span>
            ) : (
              <span>Upload files to start compression</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleCompress}
              disabled={isCompressing || filesCount === 0 || queueProgress?.processing}
              className="bg-primary hover:bg-primary/90"
            >
              <Combine className="w-4 h-4 mr-2" />
              {queueProgress?.processing ? 'Processing...' : 'Compress All'}
            </Button>
            <Button 
              onClick={onClear}
              variant="outline"
              disabled={queueProgress?.processing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {!isSubscribed && (
          <div className="text-xs text-yellow-600 mb-4">
            Ultra-high quality (above 75) is available for premium users only. <br />
            <a href="/subscription" className="underline text-blue-600">Upgrade to Premium</a> for ad-free and ultra-high quality compression!
          </div>
        )}

        {!isSubscribed && <BannerAd />}
      </div>
    </div>
  );
}
