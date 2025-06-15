"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type UserInsightsProps = {
  insights: string | null;
  isLoading: boolean;
};

export function UserInsights({ insights, isLoading }: UserInsightsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><BarChart3 /> Your Usage Insights</CardTitle>
        <CardDescription>Learn about your image analysis patterns.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Generating insights...</p>}
        {!isLoading && !insights && <p className="text-muted-foreground">No insights available yet. Analyze some images to see your stats!</p>}
        {insights && (
          <Alert className="bg-accent/50 border-accent">
            <Lightbulb className="h-5 w-5 text-accent-foreground" />
            <AlertTitle className="font-semibold text-accent-foreground">Insight</AlertTitle>
            <AlertDescription className="text-accent-foreground/90">
              {insights}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
