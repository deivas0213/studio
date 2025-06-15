"use client";

import { InfoIcon } from "lucide-react";

export function AdBanner() {
  return (
    <div className="bg-muted/50 text-muted-foreground p-3 text-center text-sm fixed bottom-0 left-0 right-0 z-40 border-t border-border">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <InfoIcon size={16} className="text-primary"/>
        <span>Advertisement Placeholder - Upgrade to Premium to remove ads.</span>
      </div>
    </div>
  );
}
