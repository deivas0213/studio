import type { AnalyzeImageOutput } from '@/ai/flows/analyze-image';

export interface ScanResult extends AnalyzeImageOutput {
  id: string;
  imageUrl: string; // The URL of the image that was analyzed (can be a data URI or remote URL)
  previewUrl: string; // The URL used for previewing the image (usually a data URI or blob URL)
  timestamp: string; // ISO string
  userId: string; // Consider making this nullable if auth is not strictly enforced for all scans
  sourceType: 'upload' | 'camera' | 'url';
}

export type UploadHistoryItem = {
  isAiGenerated: boolean;
  timestamp: string; // ISO timestamp
};

// Add any new types related to subscription or user profiles here if needed
// e.g. export type UserProfile = { id: string; subscriptionTier: 'free' | 'premium'; email?: string; }
