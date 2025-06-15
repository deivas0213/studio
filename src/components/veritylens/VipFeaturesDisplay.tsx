
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, BarChartHorizontalBig, ShieldCheck } from "lucide-react";

const vipFeatures = [
  { 
    name: "Unlimited Scans", 
    description: "Analyze as many images as you need, without daily limits.", 
    icon: Zap,
    status: "active" 
  },
  { 
    name: "Advanced Scan Analytics", 
    description: "Get deeper insights into your scanned images and trends.", 
    icon: BarChartHorizontalBig,
    status: "coming_soon"
  },
  { 
    name: "Priority Support", 
    description: "Get faster assistance from our dedicated support team.", 
    icon: ShieldCheck,
    status: "coming_soon"
  },
  {
    name: "Ad-Free Experience",
    description: "Enjoy VerityLens without any advertisements.",
    icon: Star, // Re-using Star, could be NoAdIcon or similar if available
    status: "active"
  }
];

export function VipFeaturesDisplay() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-background text-card-foreground shadow-lg rounded-20px border border-primary/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Star className="text-amber-400 fill-amber-400" /> VIP Features Unlocked!
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          You have access to all premium VerityLens capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vipFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.name} className="flex items-start gap-4 p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="p-2 bg-primary/10 rounded-md">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground flex items-center">
                  {feature.name}
                  {feature.status === "coming_soon" && (
                    <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600 bg-amber-500/10 text-xs px-1.5 py-0.5">
                      Soon
                    </Badge>
                  )}
                   {feature.status === "active" && (
                    <Badge variant="outline" className="ml-2 border-green-500 text-green-600 bg-green-500/10 text-xs px-1.5 py-0.5">
                      Active
                    </Badge>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
