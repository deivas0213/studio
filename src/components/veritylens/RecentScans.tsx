"use client";

import NextImage from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ScanResult } from "@/types";
import { History, EyeIcon, CpuIcon, CheckCircle2Icon } from "lucide-react";

type RecentScansProps = {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  isLoading?: boolean;
};

export function RecentScans({ scans, onSelectScan, isLoading }: RecentScansProps) {
  if (scans.length === 0 && !isLoading) {
    return (
      <Card className="bg-card text-card-foreground shadow-lg rounded-20px border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2"><History /> No Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your analyzed images will appear here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card text-card-foreground shadow-lg rounded-20px border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2"><History /> Recent Scans</CardTitle>
        <CardDescription className="text-muted-foreground">Review your past image analyses.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-5">
        {isLoading && scans.length === 0 && <p className="text-muted-foreground p-4">Loading recent scans...</p>}
        <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
          <div className="flex w-max space-x-4 p-1">
            {scans.map((scan) => (
              <div key={scan.id} className="overflow-hidden rounded-xl border border-primary/30 w-60 shrink-0 group transition-all hover:shadow-glow-primary bg-card hover:border-primary">
                <div className="relative aspect-video bg-muted/20">
                  <NextImage
                    src={scan.previewUrl}
                    alt={`Scan from ${new Date(scan.timestamp).toLocaleDateString()}`}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="thumbnail scan"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                   <div className="absolute bottom-2 left-2 right-2">
                    {scan.isAiGenerated ? (
                      <span className="text-xs font-semibold text-destructive-foreground bg-destructive/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <CpuIcon size={14} /> A.I. Generated
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-success-foreground bg-success/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <CheckCircle2Icon size={14} /> Likely Real
                      </span>
                    )}
                   </div>
                </div>
                <div className="p-3 bg-card/80">
                  <p className="text-xs text-muted-foreground mb-2 truncate">
                    {new Date(scan.timestamp).toLocaleString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full app-button !text-sm !py-2 !bg-secondary hover:!bg-primary hover:!text-primary-foreground"
                    onClick={() => onSelectScan(scan)}
                    aria-label={`View details for scan from ${new Date(scan.timestamp).toLocaleString()}`}
                  >
                    <EyeIcon className="mr-2 h-4 w-4" /> View Result
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {scans.length === 0 && !isLoading && (
             <p className="text-muted-foreground p-4 text-center">No scans to display yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
