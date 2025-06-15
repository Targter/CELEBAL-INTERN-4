import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { useTheme } from "../context/TC";

const ThemeSwitcher = () => {
  const {
    theme,
    setTheme,
    customColor,
    setCustomColor,
    backgroundColor,
    mode,
    fontColor,
    setMode,
  } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-4 p-4 rounded-lg shadow-md"
      style={{ backgroundColor, color: fontColor }}
    >
      <motion.a
        href="https://www.linkedin.com/in/bansalabhay/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="text-2xl"
        style={{ color: customColor }}
        aria-label="Visit my LinkedIn profile"
      >
        <FaLinkedin className="w-9 h-9 rounded-lg" />
      </motion.a>
      <div className="relative">
        <label htmlFor="mode-select" className="sr-only">
          Select Mode
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)] text-sm"
          style={{ backgroundColor: `${backgroundColor}cc`, color: fontColor }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <svg
          className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Color Picker */}
      <label htmlFor="color-picker" className="sr-only">
        Pick Custom Color
      </label>
      <input
        id="color-picker"
        type="color"
        value={customColor || "#3b82f6"}
        onChange={(e) => setCustomColor(e.target.value)}
        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        style={{ borderColor: `${fontColor}33` }}
      />
    </motion.div>
  );
};

export default ThemeSwitcher;
