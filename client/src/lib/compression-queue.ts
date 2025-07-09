import { CompressedFile } from '@/types/file';
import { compressImage, CompressionOptions, CompressionResult } from './image-compression';

export interface QueueItem {
  id: string;
  file: CompressedFile;
  options: CompressionOptions;
  priority: number;
  retryCount: number;
  maxRetries: number;
}

export interface QueueProgress {
  current: number;
  total: number;
  completed: number;
  failed: number;
  processing: boolean;
}

export class CompressionQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private concurrentLimit = 3; // Process 3 images simultaneously
  private activeJobs = new Set<string>();
  private onProgress?: (progress: QueueProgress) => void;
  private onItemComplete?: (id: string, result: CompressionResult | Error) => void;

  constructor(options?: {
    concurrentLimit?: number;
    onProgress?: (progress: QueueProgress) => void;
    onItemComplete?: (id: string, result: CompressionResult | Error) => void;
  }) {
    if (options?.concurrentLimit) {
      this.concurrentLimit = options.concurrentLimit;
    }
    this.onProgress = options?.onProgress;
    this.onItemComplete = options?.onItemComplete;
  }

  addItems(files: CompressedFile[], options: CompressionOptions): void {
    const newItems: QueueItem[] = files.map((file, index) => ({
      id: file.id,
      file,
      options: {
        ...options,
        webOptimized: true, // Enable web optimization by default
      },
      priority: index, // FIFO order
      retryCount: 0,
      maxRetries: 2,
    }));

    // Sort by priority (lower number = higher priority)
    this.queue.push(...newItems);
    this.queue.sort((a, b) => a.priority - b.priority);

    this.updateProgress();
    this.processQueue();
  }

  addItem(file: CompressedFile, options: CompressionOptions, priority = 0): void {
    const item: QueueItem = {
      id: file.id,
      file,
      options: {
        ...options,
        webOptimized: true,
      },
      priority,
      retryCount: 0,
      maxRetries: 2,
    };

    this.queue.push(item);
    this.queue.sort((a, b) => a.priority - b.priority);

    this.updateProgress();
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    this.updateProgress();

    const processNext = async (): Promise<void> => {
      if (this.activeJobs.size >= this.concurrentLimit) {
        return;
      }

      const item = this.queue.find(item => !this.activeJobs.has(item.id));
      if (!item) {
        return;
      }

      // Remove from queue and add to active jobs
      const index = this.queue.indexOf(item);
      this.queue.splice(index, 1);
      this.activeJobs.add(item.id);

      try {
        // Update file status to compressing
        this.onItemComplete?.(item.id, new Error('COMPRESSING'));

        const result = await compressImage(item.file.file, item.options);
        
        // Success
        this.activeJobs.delete(item.id);
        this.onItemComplete?.(item.id, result);
        this.updateProgress();

      } catch (error) {
        this.activeJobs.delete(item.id);

        // Retry logic
        if (item.retryCount < item.maxRetries) {
          item.retryCount++;
          item.priority += 1000; // Lower priority for retries
          this.queue.push(item);
          this.queue.sort((a, b) => a.priority - b.priority);
        } else {
          // Final failure
          this.onItemComplete?.(item.id, error as Error);
        }
        this.updateProgress();
      }

      // Continue processing if queue has items and slots available
      if (this.queue.length > 0 && this.activeJobs.size < this.concurrentLimit) {
        setTimeout(processNext, 10); // Small delay to prevent blocking
      }
    };

    // Start processing with available slots
    const promises = [];
    for (let i = 0; i < Math.min(this.concurrentLimit, this.queue.length); i++) {
      promises.push(processNext());
    }

    await Promise.all(promises);

    // Check if queue is empty and no active jobs
    if (this.queue.length === 0 && this.activeJobs.size === 0) {
      this.processing = false;
      this.updateProgress();
    }
  }

  private updateProgress(): void {
    const total = this.queue.length + this.activeJobs.size;
    const progress: QueueProgress = {
      current: this.activeJobs.size,
      total: total,
      completed: 0, // This will be calculated by the caller
      failed: 0, // This will be calculated by the caller
      processing: this.processing,
    };

    this.onProgress?.(progress);
  }

  clear(): void {
    this.queue = [];
    this.activeJobs.clear();
    this.processing = false;
    this.updateProgress();
  }

  getQueueStatus(): {
    queueLength: number;
    activeJobs: number;
    processing: boolean;
  } {
    return {
      queueLength: this.queue.length,
      activeJobs: this.activeJobs.size,
      processing: this.processing,
    };
  }

  setPriority(id: string, priority: number): void {
    const item = this.queue.find(item => item.id === id);
    if (item) {
      item.priority = priority;
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  }

  pause(): void {
    this.processing = false;
  }

  resume(): void {
    if (!this.processing && this.queue.length > 0) {
      this.processQueue();
    }
  }
}