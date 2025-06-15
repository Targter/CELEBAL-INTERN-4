// // ActiveThemeProvider.jsx
// import { createContext, useContext, useEffect, useState } from "react";

// const ActiveThemeContext = createContext();

// export function ActiveThemeProvider({ children, initialTheme }) {
//   const [activeTheme, setActiveTheme] = useState(initialTheme || "light");

//   useEffect(() => {
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(activeTheme);
//     localStorage.setItem("theme", activeTheme);

//     const meta = document.querySelector('meta[name="theme-color"]');
//     if (meta) {
//       meta.setAttribute(
//         "content",
//         activeTheme === "dark" ? "#09090b" : "#ffffff"
//       );
//     }
//   }, [activeTheme]);

//   return (
//     <ActiveThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
//       {children}
//     </ActiveThemeContext.Provider>
//   );
// }

// export function useThemeConfig() {
//   const context = useContext(ActiveThemeContext);
//   if (!context) {
//     throw new Error("useThemeConfig must be used within ActiveThemeProvider");
//   }
//   return context;
// }

//

// import { useTheme } from "./ThemeProvider";
import { useTheme } from "./TtProvider";
// import { ActiveThemeProvider } from "./ActiveThemeProvider";
import { ActiveThemeProvider } from "./ActiveTheme";
export function Providers({ children, activeThemeValue }) {
  const { theme } = useTheme();
  const effectiveTheme = activeThemeValue || theme;

  return (
    <ActiveThemeProvider initialTheme={effectiveTheme}>
      {children}
    </ActiveThemeProvider>
  );
}
