// BodyThemeManager.jsx
import { useEffect } from "react";
// import { useThemeConfig } from "./ActiveThemeProvider";
import { useThemeConfig } from "./ActiveTheme";
// import { cn } from "your-classname-utility"; // or 'classnames' or 'clsx'
import { cn } from "../lib/utils";
export function BodyThemeManager({ children }) {
  const { activeTheme } = useThemeConfig();

  useEffect(() => {
    document.body.className = cn(
      "bg-background overflow-hidden overscroll-none font-sans antialiased",
      activeTheme ? `theme-${activeTheme}` : ""
      //   fontVariables // Make sure this is defined or passed as prop
    );
  }, [activeTheme]);

  return children;
}
