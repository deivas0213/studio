"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export function LoadingSpinner({ size = 48, message = "ANALYZING IMAGE..." }: LoadingSpinnerProps) { // Adjusted default size
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-10" role="status" aria-live="polite">
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
      {message && <p className="text-lg font-semibold text-primary tracking-wider">{message}</p>}
    </div>
  );
}
