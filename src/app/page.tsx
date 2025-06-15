
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AppHeader } from "@/components/veritylens/Header";
import { ImageUploader } from "@/components/veritylens/ImageUploader";
import { ResultDisplay } from "@/components/veritylens/ResultDisplay";
import { RecentScans } from "@/components/veritylens/RecentScans";
import { UserInsights } from "@/components/veritylens/UserInsights";
import { LoadingSpinner } from "@/components/veritylens/LoadingSpinner";
import { UpgradeModal } from "@/components/veritylens/UpgradeModal";
import { AdBanner } from "@/components/veritylens/AdBanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PenToolIcon, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { analyzeImage } from "@/ai/flows/analyze-image";
import type { AnalyzeImageOutput } from "@/ai/flows/analyze-image";
import { getUsageInsights } from "@/ai/flows/get-usage-insights";

import type { ScanResult, UploadHistoryItem } from "@/types";
import { useSubscription } from "@/contexts/SubscriptionContext";

const MOCK_USER_ID = "user123"; // Replace with actual user ID from auth

export default function VerityLensPage() {
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [userInsights, setUserInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  
  const { toast } = useToast();
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const { subscriptionStatus, incrementScanCount, isUpgradeModalOpen, setIsUpgradeModalOpen, canScan, showUpgradeModal } = useSubscription();


  const toDataURL = (data: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });

  const handleAnalyze = async (data: { file?: File; url?: string }, type: 'file' | 'url') => {
    if (!canScan()) {
      showUpgradeModal();
      toast({
        variant: "destructive",
        title: "Scan Limit Reached",
        description: "Upgrade to Premium for unlimited scans.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); 

    let photoDataUri: string | undefined;
    let originalImageUrl: string = ""; 
    let previewUrl: string = ""; 
    let sourceType: 'upload' | 'camera' | 'url' = type === 'file' ? 'upload' : 'url'; 

    try {
      if (data.file) {
        sourceType = data.file.name.startsWith("camera_") ? 'camera' : 'upload';
        photoDataUri = await toDataURL(data.file);
        previewUrl = photoDataUri; 
        originalImageUrl = `localfile:${data.file.name}`; 
      } else if (data.url) {
        originalImageUrl = data.url;
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(data.url)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch image from URL.' }));
          throw new Error(errorData.message || `Network response was not ok: ${response.statusText}`);
        }
        const blob = await response.blob();
        photoDataUri = await toDataURL(blob);
        previewUrl = photoDataUri; 
      }

      if (!photoDataUri) {
        throw new Error("No image data to analyze.");
      }

      const aiResult: AnalyzeImageOutput = await analyzeImage({ photoDataUri });
      incrementScanCount(); // Increment scan count on successful analysis call

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
      setRecentScans(prevScans => [newScan, ...prevScans].slice(0, 10)); 
      
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      console.error("Analysis error:", err);
      let errorMessage = "An unexpected error occurred during analysis.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Check for specific Genkit/API errors if possible
      if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('limit')) {
        errorMessage = "The analysis service is currently busy or quota has been exceeded. Please try again later.";
      } else if (errorMessage.toLowerCase().includes('unsafe content') || errorMessage.toLowerCase().includes('blocked')) {
        errorMessage = "Image analysis was blocked due to content policy. Please try a different image.";
      }

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
    } catch (err: any)      {
      console.error("Error fetching insights:", err);
      setUserInsights("Could not load insights at this time.");
       toast({
        variant: "destructive",
        title: "Insights Error",
        description: "Failed to fetch usage insights.",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  }, [recentScans, toast]); // Added toast to dependencies

  useEffect(() => {
    if (recentScans.length > 0) {
      fetchUserInsights();
    }
  }, [recentScans, fetchUserInsights]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-5 py-4 md:py-6 space-y-10 md:space-y-12">
        
        {/* Placeholder for subscription status - to be developed further */}
        {/* <div className="text-center p-2 bg-accent/20 rounded-md">
          <p className="text-sm text-accent-foreground">
            Current Plan: <span className="font-semibold capitalize">{subscriptionStatus}</span>.
            {subscriptionStatus === 'free' && ` Scans today: ${dailyScansToday()}/${FREE_SCAN_LIMIT_PER_DAY}.`}
          </p>
        </div> */}

        <section aria-labelledby="image-upload-heading">
          <h2 id="image-upload-heading" className="sr-only">Verify Your Image</h2>
          <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
        </section>

        {isLoading && <LoadingSpinner message="VERIFYING IMAGE INTEGRITY..." />}
        
        {error && !isLoading && (
          <Alert variant="destructive" className="animate-fadeIn bg-destructive/10 border-destructive text-destructive-foreground p-5 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <AlertTitle className="text-lg font-bold">Error Occurred</AlertTitle>
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        )}
        
        {analysisResult && !isLoading && (
          <section ref={resultSectionRef} aria-labelledby="analysis-result-heading" className="animate-fadeIn">
            <h2 id="analysis-result-heading" className="sr-only">Analysis Result</h2>
            <ResultDisplay result={analysisResult} />
          </section>
        )}

        <section aria-labelledby="recent-scans-heading">
          <h2 id="recent-scans-heading" className="sr-only">Recent Scans</h2>
           <RecentScans scans={recentScans} onSelectScan={(scan) => {
             setAnalysisResult(scan);
             setTimeout(() => {
               resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }, 100);
           }} />
        </section>

        <section aria-labelledby="user-insights-heading">
           <h2 id="user-insights-heading" className="sr-only">User Insights</h2>
          <UserInsights insights={userInsights} isLoading={isLoadingInsights} />
        </section>
        
        {/* Settings/Push Notification Placeholder */}
        <section aria-labelledby="settings-heading" className="pt-4">
          <h2 id="settings-heading" className="sr-only">Settings</h2>
           <Button
              variant="outline"
              className="w-full app-button bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90"
              onClick={() => toast({ title: "Settings", description: "App settings and push notification preferences would be here."})}
            >
              <Settings2 className="mr-2" />
              APP SETTINGS & NOTIFICATIONS
            </Button>
        </section>

        <section aria-labelledby="extra-features-heading" className="pt-2">
            <h2 id="extra-features-heading" className="sr-only">Extra Features</h2>
            <Button
              variant="outline"
              className="w-full app-button border-dashed border-primary/50 !bg-transparent !text-primary hover:!bg-primary/10"
              disabled={true}
            >
              <PenToolIcon className="mr-2" />
              EXTRA FEATURES (COMING SOON)
            </Button>
        </section>

      </main>
      {subscriptionStatus === 'free' && <AdBanner />}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VerityLens. AI Lab Division.
      </footer>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
}
