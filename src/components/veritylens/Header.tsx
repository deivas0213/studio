
import NextImage from 'next/image';

export function AppHeader() {
  return (
    <header className="py-6 md:py-8 bg-background">
      <div className="container mx-auto flex items-center justify-center space-x-3">
        <NextImage
          src="https://placehold.co/50x50.png"
          alt="VerityLens Logo"
          width={50}
          height={50}
          className="rounded-md"
          data-ai-hint="app logo"
        />
        <h1 className="text-4.5xl font-black text-primary tracking-wider uppercase">
          Check <span className="text-foreground">A.I.</span>
        </h1>
      </div>
    </header>
  );
}
