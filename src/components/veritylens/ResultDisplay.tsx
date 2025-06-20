
"use client";

import NextImage from "next/image"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScanResult } from "@/types";
import { CpuIcon, CheckCircle2Icon, ZapIcon } from "lucide-react"; 

type ResultDisplayProps = {
  result: ScanResult;
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  const isAi = result.isAiGenerated;
  const confidencePercent = Math.round(result.confidenceScore * 100);

  // Text and classes will now adapt to the new theme variables
  const resultText = isAi ? "A.I. GENERATED" : "LIKELY REAL";
  const resultColorClass = isAi ? "text-destructive" : "text-success"; // --destructive (AI Red), --success (Cyan in dark, Strong Blue in light)
  const glowClass = isAi ? "glow-ai" : "glow-real"; // Uses --destructive-h/s/l or --success-h/s/l
  const borderColorClass = isAi ? "border-destructive" : "border-success"; 
  const progressTrackClass = isAi ? "[&>div]:bg-destructive" : "[&>div]:bg-success";
  
  const ResultIcon = isAi ? CpuIcon : CheckCircle2Icon;

  // The main card background will be --card (white in light, #111111 in dark).
  // Text color --card-foreground.
  // Border radius 20px.
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
        {/* Circular image preview, size ~250x250, border-radius: 125px. Glow handled by parent card. */}
        <div className={`relative w-full max-w-[220px] md:max-w-[250px] mx-auto aspect-square rounded-full overflow-hidden border-4 ${borderColorClass} shadow-lg`}>
          <NextImage
            src={result.previewUrl}
            alt="Analyzed image"
            layout="fill"
            objectFit="cover"
            data-ai-hint="analyzed image content"
            className="rounded-full" // Ensures image itself is rounded if container fails
          />
          {/* The glowClass on the parent Card will provide the animated glow effect */}
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-lg font-medium">
            {/* Confidence text: white or light gray (controlled by --foreground or --muted-foreground) */}
            <span className="text-muted-foreground">Confidence</span>
            <span className={`font-bold ${resultColorClass}`}>{confidencePercent}% ACCURACY</span>
          </div>
          <Progress value={confidencePercent} className={`h-3.5 rounded-full bg-muted/30 ${progressTrackClass}`} />
        </div>

        {/* Additional info section - ensure text uses theme colors like text-muted-foreground */}
        <div className="text-sm text-muted-foreground p-4 bg-background rounded-lg border border-border flex items-start gap-3">
          <ZapIcon className={`h-6 w-6 ${resultColorClass} shrink-0 mt-0.5`} />
          <p className="leading-relaxed">
            This image is classified as <strong>{isAi ? "AI-Generated" : "Likely Real"}</strong> with {confidencePercent}% confidence. 
            Source: {result.sourceType}. Timestamp: {new Date(result.timestamp).toLocaleString()}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
