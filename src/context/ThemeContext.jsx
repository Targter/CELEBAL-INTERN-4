import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("blue");
  const [customColor, setCustomColor] = useState("#000000");
  const [mode, setMode] = useState("light");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#1f2937");
  const [isAnimating, setIsAnimating] = useState(false);

  // Compute font color based on background
  const computeFontColor = (bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#1f2937" : "#f3f4f6";
  };

  // Apply theme and mode changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      "theme-blue",
      "theme-green",
      "theme-red",
      "theme-purple",
      "light",
      "dark"
    );

    if (mode === "light") {
      root.classList.add("light");
      setBackgroundColor("#ffffff");
      setFontColor("#1f2937");
    } else if (mode === "dark") {
      root.classList.add("dark");
      setBackgroundColor("#1f2937");
      setFontColor("#f3f4f6");
    }

    if (customColor) {
      root.style.setProperty("--theme-color", customColor);
    } else {
      root.classList.add(`theme-${theme}`);
      root.style.removeProperty("--theme-color");
    }

    root.style.setProperty("--background-color", backgroundColor);
    root.style.setProperty("--text-color", fontColor);

    // Trigger animation
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600); // Match animation duration
    return () => clearTimeout(timer);
  }, [theme, customColor, mode, backgroundColor, fontColor]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        customColor,
        setCustomColor,
        mode,
        setMode,
        backgroundColor,
        setBackgroundColor,
        fontColor,
        setFontColor,
        computeFontColor,
      }}
    >
      <div
        className={`theme-transition ${isAnimating ? "animate-wave-down" : ""}`}
        style={{ minHeight: "100vh", width: "100%", position: "relative" }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
