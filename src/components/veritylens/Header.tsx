import { CheckSquare } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center space-x-2">
        <CheckSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary font-headline">Verity<span className="text-foreground">Lens</span></h1>
      </div>
    </header>
  );
}
