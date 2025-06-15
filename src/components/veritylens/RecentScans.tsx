"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ScanResult } from "@/types";
import { History, EyeIcon, CpuIcon, UserCheckIcon } from "lucide-react";

type RecentScansProps = {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  isLoading?: boolean;
};

export function RecentScans({ scans, onSelectScan, isLoading }: RecentScansProps) {
  if (scans.length === 0 && !isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><History /> No Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your analyzed images will appear here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><History /> Recent Scans</CardTitle>
        <CardDescription>Review your past image analyses.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && scans.length === 0 && <p>Loading recent scans...</p>}
        <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
          <div className="flex w-max space-x-4">
            {scans.map((scan) => (
              <div key={scan.id} className="overflow-hidden rounded-lg border w-60 shrink-0 group transition-all hover:shadow-lg">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={scan.previewUrl}
                    alt={`Scan from ${new Date(scan.timestamp).toLocaleDateString()}`}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="thumbnail scan"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-2 left-2 right-2">
                    {scan.isAiGenerated ? (
                      <span className="text-xs font-semibold text-primary-foreground bg-primary/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <CpuIcon size={14} /> AI Generated
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-success-foreground bg-success/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <UserCheckIcon size={14} /> Likely Real
                      </span>
                    )}
                   </div>
                </div>
                <div className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(scan.timestamp).toLocaleString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
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
      </CardContent>
    </Card>
  );
}
