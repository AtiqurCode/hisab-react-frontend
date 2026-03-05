import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark';

type ThemePreferenceContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | undefined>(undefined);

const THEME_KEY = 'hisab.themePreference';

export const ThemePreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const system = useSystemColorScheme() === 'dark' ? 'dark' : 'light';
  const [colorScheme, setColorScheme] = useState<ColorScheme>(system);

  // Load persisted preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') {
          setColorScheme(stored);
        }
      } catch {
        // ignore storage errors, fall back to system
      }
    })();
  }, []);

  // Persist preference whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(THEME_KEY, colorScheme).catch(() => {});
  }, [colorScheme]);

  return (
    <ThemePreferenceContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = () => {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  }
  return ctx;
};

export const useAppColorScheme = () => {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    const system = useSystemColorScheme();
    return system === 'dark' ? 'dark' : 'light';
  }
  return ctx.colorScheme;
};

