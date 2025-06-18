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

// ThemeProvider funcional para web
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  return React.createElement(ThemeContext.Provider, { value: { theme, setTheme } }, children);
};

export const useSetTheme = () => {
  const context = useContext(ThemeContext);
  if (context) {
    return context.setTheme;
  }
  return () => {};
};
