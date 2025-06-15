
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; // Import ThemeProvider

export const metadata: Metadata = {
  title: 'VerityLens - CHECK A.I.',
  description: 'Detect AI-generated images with VerityLens',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning is often useful with theme providers */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider> {/* Wrap with ThemeProvider */}
          <SubscriptionProvider>
            {children}
          </SubscriptionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
