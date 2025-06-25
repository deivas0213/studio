
"use client";

import NextImage from "next/image"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScanResult } from "@/types";
import { CpuIcon, CheckCircle2Icon, ZapIcon, SparklesIcon } from "lucide-react"; 
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ResultDisplayProps = {
  result: ScanResult;
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  const { isPremium } = useSubscription();
  const isAi = result.isAiGenerated;
  const confidencePercent = Math.round(result.confidenceScore * 100);

  const resultText = isAi ? "A.I. GENERATED" : "LIKELY REAL";
  const resultColorClass = isAi ? "text-destructive" : "text-success";
  const glowClass = isAi ? "glow-ai" : "glow-real";
  const borderColorClass = isAi ? "border-destructive" : "border-success"; 
  const progressTrackClass = isAi ? "[&>div]:bg-destructive" : "[&>div]:bg-success";
  
  const ResultIcon = isAi ? CpuIcon : CheckCircle2Icon;

  return (
    <Card 
      className={`bg-card text-card-foreground shadow-xl rounded-20px p-5 ${glowClass} border-2 ${borderColorClass} animate-fadeIn`}
      aria-live="polite"
    >
      <CardHeader className="p-0 mb-5 text-center">
        <CardTitle className={`text-3xl md:text-4xl font-black tracking-wider uppercase ${resultColorClass} flex items-center justify-center gap-3`}>
          <ResultIcon size={36} strokeWidth={2.5} />
          {resultText}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <div className={`relative w-full max-w-[220px] md:max-w-[250px] mx-auto aspect-square rounded-full overflow-hidden border-4 ${borderColorClass} shadow-lg`}>
          <NextImage
            src={result.previewUrl}
            alt="Analyzed image"
            layout="fill"
            objectFit="cover"
            data-ai-hint="analyzed image content"
            className="rounded-full"
          />
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-lg font-medium">
            <span className="text-muted-foreground">Confidence</span>
            <span className={`font-bold ${resultColorClass}`}>{confidencePercent}% ACCURACY</span>
          </div>
          <Progress value={confidencePercent} className={`h-3.5 rounded-full bg-muted/30 ${progressTrackClass}`} />
        </div>

        {isPremium() && result.isAiImproved && (
           <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500">
             <SparklesIcon className="h-5 w-5" />
             <AlertTitle className="font-bold">VIP: AI Enhancement Detected</AlertTitle>
             <AlertDescription>
              This appears to be a real photo that has been significantly altered by AI tools. (Confidence: {Math.round(result.improvementConfidence * 100)}%)
             </AlertDescription>
           </Alert>
        )}

        <div className="text-sm text-muted-foreground p-4 bg-background rounded-lg border border-border flex items-start gap-3">
          <ZapIcon className={`h-6 w-6 ${resultColorClass} shrink-0 mt-0.5`} />
          <p className="leading-relaxed">
            <strong>Analysis:</strong> {result.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
