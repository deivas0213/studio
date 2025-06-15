"use client";

import NextImage from "next/image"; // Renamed to avoid conflict
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScanResult } from "@/types";
import { CpuIcon, CheckCircle2Icon } from "lucide-react"; // Using CheckCircle2Icon for "REAL"

type ResultDisplayProps = {
  result: ScanResult;
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  const isAi = result.isAiGenerated;
  const confidencePercent = Math.round(result.confidenceScore * 100);

  const resultText = isAi ? "A.I. GENERATED" : "LIKELY REAL";
  const resultColorClass = isAi ? "text-destructive" : "text-primary"; // AI Red, REAL Cyan
  const glowClass = isAi ? "glow-ai" : "glow-real";
  const borderColorClass = isAi ? "border-destructive" : "border-primary";
  const progressTrackClass = isAi ? "[&>div]:bg-destructive" : "[&>div]:bg-primary";
  
  const ResultIcon = isAi ? CpuIcon : CheckCircle2Icon;

  return (
    <Card 
      className={`bg-dark-card-bg text-card-foreground shadow-xl rounded-20px p-5 ${glowClass} border-2 ${borderColorClass} animate-fadeIn`}
      aria-live="polite"
    >
      <CardHeader className="p-0 mb-5 text-center">
        <CardTitle className={`text-3xl md:text-4xl font-black tracking-wider uppercase ${resultColorClass} flex items-center justify-center gap-3`}>
          <ResultIcon size={36} strokeWidth={2.5} />
          {resultText}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        <div className={`relative w-full max-w-[280px] md:max-w-[300px] mx-auto aspect-square rounded-full overflow-hidden border-4 ${borderColorClass} ${glowClass} shadow-2xl`}>
          <NextImage
            src={result.previewUrl}
            alt="Analyzed image"
            layout="fill"
            objectFit="cover"
            data-ai-hint="analyzed image content"
            className="rounded-full"
          />
           {/* Inner shadow for depth (optional) */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]"></div>
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-lg font-medium">
            <span className="text-muted-foreground">Confidence</span>
            <span className={`font-bold ${resultColorClass}`}>{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className={`h-3.5 rounded-full bg-muted/30 ${progressTrackClass}`} />
        </div>

        <div className="text-sm text-muted-foreground p-4 bg-black/30 rounded-lg border border-muted/50 flex items-start gap-3">
          <ResultIcon className={`h-6 w-6 ${resultColorClass} shrink-0 mt-0.5`} />
          <p className="leading-relaxed">
            This image is classified as {isAi ? "AI-Generated" : "Likely Real"} with {confidencePercent}% confidence. 
            Analysis based on source: {result.sourceType}. Timestamp: {new Date(result.timestamp).toLocaleString()}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
