// ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProviderr({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = false,
}) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme && savedTheme !== "system" ? savedTheme : defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== "undefined" && enableSystem) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return undefined;
  });

  const resolvedTheme =
    theme === "system" && enableSystem ? systemTheme : theme;

  useEffect(() => {
    if (enableSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [enableSystem]);

  useEffect(() => {
    if (!resolvedTheme) return;

    if (attribute === "class") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolvedTheme);

      if (disableTransitionOnChange) {
        // Disable all transitions, including view transitions
        const styleElement = document.createElement("style");
        styleElement.textContent = `
          *, *:before, *:after {
            transition: none !important;
          }
          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation: none !important;
          }
        `;
        document.head.appendChild(styleElement);
        setTimeout(() => styleElement.remove(), 0);
      }
    }

    localStorage.setItem("theme", theme);

    if (enableColorScheme) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute(
          "content",
          resolvedTheme === "dark" ? "#09090b" : "#ffffff"
        );
      }
    }
  }, [
    resolvedTheme,
    theme,
    attribute,
    disableTransitionOnChange,
    enableColorScheme,
  ]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
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
