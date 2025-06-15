"use client";

import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/veritylens/Header";
import { ImageUploader } from "@/components/veritylens/ImageUploader";
import { ResultDisplay } from "@/components/veritylens/ResultDisplay";
import { RecentScans } from "@/components/veritylens/RecentScans";
import { UserInsights } from "@/components/veritylens/UserInsights";
import { LoadingSpinner } from "@/components/veritylens/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { analyzeImage } from "@/ai/flows/analyze-image";
import type { AnalyzeImageOutput } from "@/ai/flows/analyze-image";
import { getUsageInsights } from "@/ai/flows/get-usage-insights";

import type { ScanResult, UploadHistoryItem } from "@/types";

// Mock user ID for now
const MOCK_USER_ID = "user123";

export default function VerityLensPage() {
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [userInsights, setUserInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const { toast } = useToast();

  // Helper function to convert File or fetched Blob to data URI
  const toDataURL = (data: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });

  const handleAnalyze = async (data: { file?: File; url?: string }, type: 'file' | 'url') => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous result

    let photoDataUri: string | undefined;
    let originalImageUrl: string = ""; // This will be what's stored as imageUrl
    let previewUrl: string = ""; // This is for the immediate preview
    let sourceType: 'upload' | 'camera' | 'url' = type === 'file' ? 'upload' : 'url'; // Default for file

    try {
      if (data.file) {
        if (data.file.name === 'camera_image.jpg') sourceType = 'camera'; // Simple heuristic for camera
        photoDataUri = await toDataURL(data.file);
        previewUrl = photoDataUri; // Data URI can be used for preview
        originalImageUrl = `localfile:${data.file.name}`; // Placeholder for local file
      } else if (data.url) {
        originalImageUrl = data.url;
        // Fetch the image from URL and convert to data URI for analysis & preview
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(data.url)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch image from URL.' }));
          throw new Error(errorData.message || `Network response was not ok: ${response.statusText}`);
        }
        const blob = await response.blob();
        photoDataUri = await toDataURL(blob);
        previewUrl = photoDataUri; // Use data URI for preview to avoid CORS issues with direct URL
      }

      if (!photoDataUri) {
        throw new Error("No image data to analyze.");
      }

      const aiResult: AnalyzeImageOutput = await analyzeImage({ photoDataUri });

      const newScan: ScanResult = {
        ...aiResult,
        id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
        imageUrl: originalImageUrl,
        previewUrl: previewUrl, 
        timestamp: new Date().toISOString(),
        userId: MOCK_USER_ID,
        sourceType: sourceType,
      };

      setAnalysisResult(newScan);
      setRecentScans(prevScans => [newScan, ...prevScans].slice(0, 10)); // Keep last 10

    } catch (err: any) {
      console.error("Analysis error:", err);
      const errorMessage = err.message || "An unexpected error occurred during analysis.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUserInsights = useCallback(async () => {
    if (recentScans.length === 0) {
      setUserInsights(null);
      return;
    }
    setIsLoadingInsights(true);
    try {
      const uploadHistory: UploadHistoryItem[] = recentScans.map(scan => ({
        isAiGenerated: scan.isAiGenerated,
        timestamp: scan.timestamp,
      }));
      
      const insightsResult = await getUsageInsights({ userId: MOCK_USER_ID, uploadHistory });
      setUserInsights(insightsResult.insights);
    } catch (err: any) {
      console.error("Error fetching insights:", err);
      // Don't show toast for insights error, just log it or display a mild message.
      setUserInsights("Could not load insights at this time.");
    } finally {
      setIsLoadingInsights(false);
    }
  }, [recentScans]);

  useEffect(() => {
    // Fetch insights when recentScans change (e.g., after a new scan)
    // Debounce or add a condition like "if scans > N" if this becomes too frequent
    if (recentScans.length > 0) {
      fetchUserInsights();
    }
  }, [recentScans, fetchUserInsights]);


  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-2 md:px-6 md:py-4 space-y-8">
        <section aria-labelledby="image-upload-heading">
          <h2 id="image-upload-heading" className="sr-only">Verify Your Image</h2>
          <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
        </section>

        {isLoading && <LoadingSpinner message="Verifying image integrity..." />}
        
        {error && !isLoading && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {analysisResult && !isLoading && (
          <section aria-labelledby="analysis-result-heading" className="animate-fadeIn">
            <h2 id="analysis-result-heading" className="sr-only">Analysis Result</h2>
            <ResultDisplay result={analysisResult} />
          </section>
        )}

        <section aria-labelledby="recent-scans-heading">
          <h2 id="recent-scans-heading" className="sr-only">Recent Scans</h2>
           <RecentScans scans={recentScans} onSelectScan={(scan) => {
             setAnalysisResult(scan);
             window.scrollTo({ top: 0, behavior: 'smooth' });
           }} />
        </section>

        <section aria-labelledby="user-insights-heading">
           <h2 id="user-insights-heading" className="sr-only">User Insights</h2>
          <UserInsights insights={userInsights} isLoading={isLoadingInsights} />
        </section>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VerityLens. All rights reserved.
      </footer>
    </div>
  );
}
