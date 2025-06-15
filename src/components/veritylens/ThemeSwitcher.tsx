
"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SunIcon, MoonIcon, LaptopIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: LaptopIcon },
  ];

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Appearance</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Select your preferred interface theme.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <RadioGroup
          value={theme}
          onValueChange={(newTheme) => setTheme(newTheme as 'light' | 'dark' | 'system')}
          className="space-y-1"
        >
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <Label
                key={t.value}
                htmlFor={`theme-${t.value}`}
                className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                  theme === t.value ? 'border-primary bg-accent/30' : 'border-border'
                }`}
              >
                <RadioGroupItem value={t.value} id={`theme-${t.value}`} className="sr-only" />
                <Icon className={`h-5 w-5 ${theme === t.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${theme === t.value ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
