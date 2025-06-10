import React from "react";
import { motion } from "framer-motion";

const ChartsHeader = ({ category, title }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-6"
  >
    <p className="text-gray-500 dark:text-gray-400">{category}</p>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
      {title}
    </h1>
  </motion.div>
);

export default ChartsHeader;
