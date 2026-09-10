import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'APP_THEME';

export type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setThemeState(systemTheme === 'dark' ? 'dark' : 'light');
      }
    })();
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    AsyncStorage.setItem(THEME_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useColorScheme debe usarse dentro de ThemeProvider');
  return context.theme;
};

export const useSetTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useSetTheme debe usarse dentro de ThemeProvider');
  return context.setTheme;
}; 