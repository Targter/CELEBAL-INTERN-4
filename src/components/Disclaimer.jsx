import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import { useTheme } from "../context/TC";

const Disclaimer = () => {
  const { fontColor, customColor } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="fixed top-2 left-1/2 transform -translate-x-1/2 text-center text-sm p-4 rounded-lg shadow-lg flex space-x-2 "
      style={{ color: `white`, backgroundColor: customColor }}
    >
      <FaExclamationTriangle className="w-4 h-4" />
      <p>Built by Abhay Bansal. Data is not currently saved to the backend.</p>
    </motion.div>
  );
};

export default Disclaimer;
