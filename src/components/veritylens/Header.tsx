
import NextImage from 'next/image';

export function AppHeader() {
  return (
    <header className="py-6 md:py-8 bg-background">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        {/* Updated logo path */}
        <NextImage
          src="/unmask_ai_logo_main.png" 
          alt="Unmask.AI Logo"
          width={50}
          height={50}
          className="rounded-md"
          data-ai-hint="app logo"
        />
        <h1 className="text-4.5xl font-black text-primary tracking-wider uppercase">
          Unmask <span className="text-foreground">AI</span>
        </h1>
      </div>
    </header>
  );
}
