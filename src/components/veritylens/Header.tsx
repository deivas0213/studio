import { ScanLine } from 'lucide-react'; // Using ScanLine for a more futuristic feel

export function AppHeader() {
  return (
    <header className="py-6 md:py-8">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        <ScanLine className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-4.5xl font-black text-primary tracking-wider uppercase">
          Check <span className="text-foreground">A.I.</span>
        </h1>
      </div>
    </header>
  );
}
