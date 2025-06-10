// import { useEffect } from "react";

// const useLocalStorage = ({ theme, customColor, setTheme, setCustomColor }) => {
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     const savedColor = localStorage.getItem("customColor");
//     if (savedTheme) setTheme(savedTheme);
//     if (savedColor) setCustomColor(savedColor);
//   }, [setTheme, setCustomColor]);

//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//     localStorage.setItem("customColor", customColor);
//   }, [theme, customColor]);
// };

// export default useLocalStorage;

//

import { useEffect } from "react";

const useLocalStorage = ({
  theme,
  customColor,
  setTheme,
  setCustomColor,
  mode,
  setMode,
  backgroundColor,
  setBackgroundColor,
  fontColor,
  setFontColor,
}) => {
  // Load from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedColor = localStorage.getItem("customColor");
    const savedMode = localStorage.getItem("mode");
    const savedBgColor = localStorage.getItem("backgroundColor");
    const savedFontColor = localStorage.getItem("fontColor");

    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setCustomColor(savedColor);
    if (savedMode) setMode(savedMode);
    if (savedBgColor) setBackgroundColor(savedBgColor);
    if (savedFontColor) setFontColor(savedFontColor);
  }, [setTheme, setCustomColor, setMode, setBackgroundColor, setFontColor]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("customColor", customColor);
    localStorage.setItem("mode", mode);
    localStorage.setItem("backgroundColor", backgroundColor);
    localStorage.setItem("fontColor", fontColor);
  }, [theme, customColor, mode, backgroundColor, fontColor]);
};

export default useLocalStorage;
