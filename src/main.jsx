import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Providers } from "./theme/Providers.jsx";
import { ThemeProviderr } from "./theme/TtProvider.jsx";
// import { ThemeProvider } from "./context/Themecontext.jsx";
// import { ThemeProvider } from "./context/Themecontext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
// src\context\Themecontext.jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProviderr>
      <Providers>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Providers>
    </ThemeProviderr>
  </StrictMode>
);
