import React, { useEffect, useState, ReactNode, createContext, useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const context = useContext(ThemeContext);
  if (context) {
    return context.theme;
  }
  
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme || 'light';
  }

  return 'light';
}

// ThemeProvider funcional para web con persistencia
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('APP_THEME');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('APP_THEME', newTheme);
  };

  return React.createElement(ThemeContext.Provider, { value: { theme, setTheme } }, children);
};

export const useSetTheme = () => {
  const context = useContext(ThemeContext);
  if (context) {
    return context.setTheme;
  }
  return () => {};
};
