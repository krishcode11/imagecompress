import { useState, useCallback, useRef, useEffect } from 'react';
import { Combine, Shield, Zap, Settings } from 'lucide-react';
import { UserNavbar } from '@/components/user-navbar';
import { UploadZone } from '@/components/upload-zone';
import CompressionControls from '@/components/compression-controls';
import { FileGrid } from '@/components/file-grid';
import { StatsSummary } from '@/components/stats-summary';
import { CompressedFile, CompressionStats } from '@/types/file';
import { calculateSavings, CompressionResult } from '@/lib/image-compression';
import { CompressionQueue, QueueProgress } from '@/lib/compression-queue';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionQuery } from "@/hooks/useSubscriptionQuery";
import { useMemo } from 'react';
import AdsterraBanner from "../components/adsterra-banner";
import BannerAd from "../components/BannerAd";
import SocialBarAd from "../components/SocialBarAd";
import PopunderAd from "../components/PopunderAd";
import { subscriptionPlans, SubscriptionPlan } from "../../../shared/plans";

export default function Compress() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [queueProgress, setQueueProgress] = useState<QueueProgress>({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
    processing: false,
  });
  const { toast } = useToast();
  const compressionQueue = useRef<CompressionQueue>();
  const { data: subscriptionData } = useSubscriptionQuery();

  const activePlan = useMemo(() => {
    const freePlan: SubscriptionPlan = {
      id: "free",
      name: "Free Tier",
      description: "Free users with limited access",
      price: 0,
      currency: "USD",
      intervalType: "MONTH",
      intervals: 1,
      features: [
        "Up to 10 compressions/day",
        "All image formats support",
        "Standard compression quality",
        "Basic support",
        "Ads supported"
      ],
      maxCompressions: 10,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      priority: 0,
      isActive: true,
    };

        const subscription = subscriptionData?.subscription;

    if (subscription && subscription.status === 'ACTIVE') {
      const plan = subscriptionPlans.find(p => p.id === subscription.planId);
      return plan || freePlan;
    }

    return freePlan;
  }, [subscriptionData]);
  const maxCompressions = activePlan.maxCompressions ?? Infinity;
  const maxFileSize = activePlan.maxFileSize;

  // Initialize compression queue
  if (!compressionQueue.current) {
    compressionQueue.current = new CompressionQueue({
      concurrentLimit: 3,
      onProgress: (progress) => {
        setQueueProgress(progress);
      },
      onItemComplete: (id, result) => {
        if (result instanceof Error) {
          if (result.message === 'COMPRESSING') {
            // Update status to compressing
            setFiles(prev => prev.map(f => 
              f.id === id ? { ...f, status: 'compressing', progress: 20 } : f
            ));
          } else {
            // Handle error
            setFiles(prev => prev.map(f => 
              f.id === id 
                ? { 
                    ...f, 
                    status: 'error', 
                    error: result.message,
                    progress: 0 
                  } 
                : f
            ));
          }
        } else {
          // Handle successful compression
          const compressionResult = result as CompressionResult;
          setFiles(prev => prev.map(f => 
            f.id === id 
              ? {
                  ...f,
                  compressedBlob: compressionResult.blob,
                  compressedSize: compressionResult.compressedSize,
                  compressedPreview: compressionResult.preview,
                  compressionRatio: compressionResult.compressionRatio,
                  originalDimensions: compressionResult.originalDimensions,
                  compressedDimensions: compressionResult.compressedDimensions,
                  quality: compressionResult.quality,
                  savings: calculateSavings(f.originalSize, compressionResult.compressedSize),
                  status: 'compressed',
                  progress: 100,
                }
              : f
          ));
        }
      }
    });
  }

  const handleFilesUploaded = useCallback((uploadedFiles: File[]) => {
    // Enforce maxCompressions
    if (files.length + uploadedFiles.length > maxCompressions) {
      toast({
        title: "Compression limit reached",
        description: `Your plan allows up to ${maxCompressions} files. Please upgrade for more.`,
        variant: "destructive",
      });
      return;
    }
    const newFiles: CompressedFile[] = uploadedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      originalSize: file.size,
      preview: URL.createObjectURL(file),
      status: 'ready',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files uploaded",
      description: `${uploadedFiles.length} files ready for compression`,
    });
  }, [toast, files.length, maxCompressions]);

  const handleCompress = async (quality: number) => {
    if (!compressionQueue.current) return;
    
    setIsCompressing(true);
    
    try {
      const readyFiles = files.filter(f => f.status === 'ready');
      
      if (readyFiles.length === 0) {
        toast({
          title: "No files to compress",
          description: "Please upload some files first",
          variant: "destructive",
        });
        return;
      }

      // Add files to compression queue with web optimization
      compressionQueue.current.addItems(readyFiles, {
        quality,
        webOptimized: true,
        progressive: quality > 70, // Enable progressive JPEG for higher quality
        removeMetadata: true,
      });
      
      toast({
        title: "Compression started",
        description: `Added ${readyFiles.length} files to compression queue`,
      });
      
      // Set files to queued status
      setFiles(prev => prev.map(f => 
        readyFiles.some(rf => rf.id === f.id) 
          ? { ...f, status: 'compressing', progress: 10 }
          : f
      ));
      
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "Could not start compression process",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleClear = () => {
    // Clear compression queue
    if (compressionQueue.current) {
      compressionQueue.current.clear();
    }
    
    // Clean up object URLs
    files.forEach(file => {
      URL.revokeObjectURL(file.preview);
      if (file.compressedPreview) {
        URL.revokeObjectURL(file.compressedPreview);
      }
    });
    
    setFiles([]);
    setIsCompressing(false);
    setQueueProgress({
      current: 0,
      total: 0,
      completed: 0,
      failed: 0,
      processing: false,
    });
    
    toast({
      title: "Files cleared",
      description: "All files and compression queue cleared",
    });
  };

  const getStats = (): CompressionStats => {
    const compressedFiles = files.filter(f => f.status === 'compressed');
    const totalOriginalSize = compressedFiles.reduce((sum, f) => sum + f.originalSize, 0);
    const totalCompressedSize = compressedFiles.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
    const totalSavings = totalOriginalSize > 0 ? calculateSavings(totalOriginalSize, totalCompressedSize) : 0;

    return {
      totalFiles: compressedFiles.length,
      originalSize: totalOriginalSize,
      compressedSize: totalCompressedSize,
      totalSavings,
    };
  };

  const hasCompressedFiles = files.some(f => f.status === 'compressed');
  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <PopunderAd />
      <SocialBarAd />
      <UserNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Compress Your Images</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Instantly reduce image file size while preserving quality. No limits, no sign up required.
            </p>
          </div>
        </section>
        {/* Banner Ad below hero */}
        <BannerAd />
        {/* Upload Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Compress Your Images</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload multiple image files and compress them with adjustable quality settings. 
              Supports all image formats with intelligent compression. All processing happens in your browser for maximum privacy and speed.
            </p>
          </div>

          <UploadZone 
            onFilesUploaded={handleFilesUploaded}
            disabled={isCompressing}
            maxFileSize={maxFileSize}
          />
        </section>

        {/* Compression Controls */}
        {files.length > 0 && (
          <section className="mb-8">
            <CompressionControls
              onCompress={handleCompress}
              onClear={handleClear}
              isCompressing={isCompressing || queueProgress.processing}
              filesCount={files.filter(f => f.status === 'ready').length}
              queueProgress={queueProgress}
              plan={activePlan}
            />
          </section>
        )}

        {/* File Grid */}
        {files.length > 0 && (
          <section className="mb-8">
            <FileGrid
              files={files}
              onDownloadAll={() => {}}
              canDownloadAll={hasCompressedFiles}
            />
          </section>
        )}

        {/* Stats Summary */}
        {hasCompressedFiles && (
          <section className="mb-8">
            <StatsSummary stats={stats} />
          </section>
        )}

        {/* Features Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose Our Image Compressor?</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Professional-grade image compression for all formats with privacy-first approach and lightning-fast processing.
            </p>
          </div>
          {/* Show plan features */}
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Your Plan: {activePlan.name}</h3>
            <ul className="inline-block text-left list-disc ml-6 text-slate-700">
              {activePlan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">100% Private</h3>
              <p className="text-slate-600">All compression happens in your browser. Your images never leave your device.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600">Client-side processing means instant compression without waiting for uploads.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Full Control</h3>
              <p className="text-slate-600">Adjust compression quality to find the perfect balance between size and quality.</p>
            </div>
          </div>
        </section>

        {/* Lower Middle Ad Section */}
        <div className="flex justify-center my-16">
          <AdsterraBanner />
        </div>

        {/* AdSense Ad - Footer Area */}
        <section className="mt-12 mb-8">
          <div className="flex justify-center">
            {/* AdSenseBanner adSlot="1122334455" className="max-w-4xl" /> */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Combine className="w-5 h-5 text-primary" />
              <span className="text-slate-600">Image Compressor</span>
            </div>
            <div className="text-sm text-slate-500">
              Built with privacy in mind • All processing happens locally
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
