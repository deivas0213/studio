"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export function LoadingSpinner({ size = 48, message = "Analyzing..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-8" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
}
