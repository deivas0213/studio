
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'veritylens-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize theme to a consistent default for SSR and initial client render.
  //    'dark' is the specified default for first launch if no preference.
  const [theme, setThemeState] = useState<Theme>('dark');
  //    resolvedTheme should also match this initial default.
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // 2. Callback to apply theme (manipulates DOM, sets resolvedTheme)
  const applyTheme = useCallback((currentThemeToApply: Theme) => {
    let newResolvedThemeVal: 'light' | 'dark';
    if (currentThemeToApply === 'system') {
      newResolvedThemeVal = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      newResolvedThemeVal = currentThemeToApply;
    }

    setResolvedTheme(newResolvedThemeVal);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newResolvedThemeVal);
  }, []); // Empty dependency array for useCallback, setResolvedTheme is stable

  // 3. Effect to load user preference from localStorage AFTER initial mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    // If a theme is stored, set it. Otherwise, it remains the initial 'dark'.
    // If 'system' is preferred and stored, it will be set.
    // This handles "default to Dark Mode on first launch" (if nothing in localStorage)
    // and "persist user's theme preference".
    if (storedTheme) {
      setThemeState(storedTheme);
    }
    // No explicit 'else' needed because useState already defaulted to 'dark'.
    // If we want "respect system if no user preference", then:
    // else { setThemeState('system'); }
    // But current PRD implies 'dark' is the ultimate default on first launch.
  }, []); // Empty dependency array means this runs once on the client after mount.

  // 4. Effect to apply the theme whenever the `theme` state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // 5. Listener for system theme changes (only relevant if `theme` is 'system')
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') { // Only re-apply if the current setting is 'system'
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]); // Re-run if theme setting changes or applyTheme callback changes

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

