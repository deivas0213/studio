
import { ScanLine } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 md:py-8 bg-background">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        {/* The ScanLine icon will inherit text-primary color defined in globals.css */}
        <ScanLine className="h-10 w-10 text-primary" /> 
        <h1 className="text-4.5xl font-black text-primary tracking-wider uppercase">
          Check <span className="text-foreground">A.I.</span>
        </h1>
      </div>
    </header>
  );
}
