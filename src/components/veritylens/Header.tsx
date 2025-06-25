
import NextImage from 'next/image';

export function AppHeader() {
  return (
    <header className="py-6 md:py-8 bg-background">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
        <NextImage
          src="/unmask_ai_logo_main.png" 
          alt="Unmask.AI Logo"
          width={70}
          height={70}
          className="rounded-md"
          data-ai-hint="app logo"
        />
        <h1 className="text-3xl font-black text-primary tracking-wider uppercase">
          Unmask <span className="text-foreground">AI</span>
        </h1>
      </div>
    </header>
  );
}
