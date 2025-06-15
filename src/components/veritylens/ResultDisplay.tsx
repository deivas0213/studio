"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ScanResult } from "@/types";
import { CheckCircle, AlertTriangle, CpuIcon, UserCheckIcon } from "lucide-react";

type ResultDisplayProps = {
  result: ScanResult;
};

export function ResultDisplay({ result }: ResultDisplayProps) {
  const isAi = result.isAiGenerated;
  const confidencePercent = Math.round(result.confidenceScore * 100);

  return (
    <Card 
      className={`shadow-xl transition-all duration-500 ease-out animate-fadeIn ${isAi ? "glow-ai border-primary" : "glow-real border-success"}`}
      aria-live="polite"
    >
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-2xl flex items-center justify-between">
          Analysis Result
          {isAi ? (
            <Badge variant="destructive" className="text-lg bg-primary hover:bg-primary/90 border-primary text-primary-foreground py-1 px-3">
              <CpuIcon className="mr-2 h-5 w-5" /> AI Generated
            </Badge>
          ) : (
            <Badge variant="default" className="text-lg bg-success hover:bg-success/90 border-success text-success-foreground py-1 px-3">
              <UserCheckIcon className="mr-2 h-5 w-5" /> Likely Real
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
          <Image
            src={result.previewUrl}
            alt="Analyzed image"
            layout="fill"
            objectFit="contain"
            data-ai-hint="analyzed image"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className={`font-bold ${isAi ? 'text-primary' : 'text-success'}`}>{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className={`h-3 ${isAi ? '[&>div]:bg-primary' : '[&>div]:bg-success'}`} />
        </div>

        <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md flex items-start gap-2">
          {isAi ? <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> : <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />}
          <p>
            This image is determined to be {isAi ? "AI-generated" : "a real photograph"} with {confidencePercent}% confidence. 
            Source: {result.sourceType}. Timestamp: {new Date(result.timestamp).toLocaleString()}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
