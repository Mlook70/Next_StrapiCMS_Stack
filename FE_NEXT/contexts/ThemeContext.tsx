'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeContext = createContext({
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    // Initialize theme from local storage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDark(savedTheme === 'dark');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);