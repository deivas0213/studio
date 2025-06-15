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
    <Card className="bg-card text-card-foreground shadow-lg rounded-20px border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2"><BarChart3 /> Your Usage Insights</CardTitle>
        <CardDescription className="text-muted-foreground">Learn about your image analysis patterns.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Generating insights...</p>}
        {!isLoading && !insights && <p className="text-muted-foreground">No insights available yet. Analyze some images to see your stats!</p>}
        {insights && (
          <Alert className="bg-accent/20 border-accent/50 text-accent-foreground rounded-lg">
            <Lightbulb className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent-foreground">Insight</AlertTitle>
            <AlertDescription className="text-foreground/90">
              {insights}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
