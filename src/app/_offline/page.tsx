
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 text-center">
      <WifiOff size={64} className="text-primary mb-6" />
      <h1 className="text-3xl font-bold text-primary mb-3">You are Offline</h1>
      <p className="text-lg text-muted-foreground mb-2">
        It looks like you're not connected to the internet.
      </p>
      <p className="text-muted-foreground">
        Please check your connection and try again. Some content may be unavailable until you're back online.
      </p>
    </div>
  );
}
