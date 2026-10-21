"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  const applyThemeClass = (t: Theme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const body = document.body;
      if (t === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        if (body) {
          body.classList.add("dark");
          body.setAttribute("data-theme", "dark");
        }
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
        if (body) {
          body.classList.remove("dark");
          body.setAttribute("data-theme", "light");
        }
      }
    }
  };

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme === "dark" || storedTheme === "light") {
        setThemeState(storedTheme);
        applyThemeClass(storedTheme);
      } else {
        // Default is light as requested by user
        setThemeState("light");
        applyThemeClass("light");
      }
    } catch {
      // fallback
    }
    setMounted(true);
  }, []);

  // Guarantee DOM stays in sync with theme state
  useEffect(() => {
    if (mounted) {
      applyThemeClass(theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // storage unavailable
    }
    applyThemeClass(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", nextTheme);
      } catch {
        // storage unavailable
      }
      applyThemeClass(nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
