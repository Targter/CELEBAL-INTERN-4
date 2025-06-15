import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/TC";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaCalendarAlt,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaChartArea,
} from "react-icons/fa";
import { RiGroup2Fill } from "react-icons/ri";
import { PiKanbanFill, PiChartPolarFill } from "react-icons/pi";
import { BiSolidDoughnutChart } from "react-icons/bi";
import { MdOutlineStackedBarChart } from "react-icons/md";
import { TbChartRadar } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  const { backgroundColor, fontColor, customColor } = useTheme();

  // Handle window resize to adjust sidebar state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setIsOpen(false);
        setIsDashboardOpen(false);
        setIsKanbanOpen(false);
      } else if (width >= 640 && width < 1024) {
        setIsOpen(false);
        setIsDashboardOpen(false);
        setIsKanbanOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-all duration-300 group relative ${
      isActive ? "text-white shadow-lg scale-105" : "hover:bg-opacity-20"
    } hover:bg-${customColor} hover:shadow-md hover:scale-105`;

  const activeStyle = ({ isActive }) =>
    isActive
      ? { backgroundColor: customColor, color: "#ffffff" }
      : { color: fontColor };

  const navItems = [
    { to: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { to: "/batches", label: "Batches", icon: <FaUsers /> },
    { to: "/calenders", label: "Calendar", icon: <FaCalendarAlt /> },
    { to: "/profiles", label: "Team", icon: <RiGroup2Fill /> },
  ];

  const chartItems = [
    { to: "/charts/area", label: "Area Chart", icon: <FaChartArea /> },
    { to: "/charts/bar", label: "Bar Chart", icon: <FaChartBar /> },
    {
      to: "/charts/doughnut",
      label: "Doughnut Chart",
      icon: <BiSolidDoughnutChart />,
    },
    { to: "/charts/line", label: "Line Chart", icon: <FaChartLine /> },
    { to: "/charts/pie", label: "Pie Chart", icon: <FaChartPie /> },
    {
      to: "/charts/polar",
      label: "Polar Area Chart",
      icon: <PiChartPolarFill />,
    },
    { to: "/charts/radar", label: "Radar Chart", icon: <TbChartRadar /> },
    {
      to: "/charts/stack",
      label: "Stack Chart",
      icon: <MdOutlineStackedBarChart />,
    },
  ];

  const adminItems = [{ to: "/settings", label: "Settings", icon: <FaCog /> }];

  const dashboardItems = [
    { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/hp", label: "Dashboard-2", icon: <FaTachometerAlt /> },
  ];

  const kanbanItems = [
    { to: "/kanban", label: "Kanban Board", icon: <PiKanbanFill /> },
    { to: "/kanban2", label: "Kanban Board 2", icon: <PiKanbanFill /> },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.4 } },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        type: "spring",
        stiffness: 120,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <div
      className={`h-full shadow-2xl transition-all duration-500 z-50 ${
        isOpen ? "w-72" : "w-16 sm:w-16"
      } ${isOpen ? "block" : "block sm:block"}`}
      style={{ backgroundColor }}
      aria-label="Sidebar Navigation"
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        }}
        className="p-4 w-full flex items-center justify-between hover:bg-opacity-20 hover:bg-gray-200 transition-colors duration-300 rounded-lg"
        aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        style={{ color: fontColor }}
      >
        <IoIosArrowForward
          className={`w-6 h-6 transition-transform duration-400 ease-in-out ${
            isOpen ? "rotate-180 scale-110" : "scale-100"
          }`}
        />
      </button>

      <nav className="space-y-2 px-3 mb-12">
        {/* Dashboards Section */}
        <motion.div
          className="px-3 py-2 text-xs uppercase tracking-wide font-semibold cursor-pointer rounded-md hover:bg-opacity-10 hover:bg-gray-200 transition-colors duration-200"
          style={{ color: `${fontColor}80` }}
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen && (
            <div className="flex items-center justify-between">
              <span>Dashboards</span>
              <IoIosArrowForward
                className={`w-4 h-4 transition-transform duration-300 ${
                  isDashboardOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          )}
        </motion.div>
        <AnimatePresence>
          {isDashboardOpen && isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="ml-4"
            >
              {dashboardItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <NavLink
                    to={item.to}
                    className={navLinkClass}
                    style={activeStyle}
                    aria-label={item.label}
                    onClick={() =>
                      isMobileMenuOpen && setIsMobileMenuOpen(false)
                    }
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {isOpen && <span>{item.label}</span>}
                    {!isOpen && (
                      <span
                        className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-lg"
                        style={{ backgroundColor: customColor }}
                      >
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kanban Boards Section */}
        <motion.div
          className="px-3 py-2 text-xs uppercase tracking-wide font-semibold cursor-pointer rounded-md hover:bg-opacity-10 hover:bg-gray-200 transition-colors duration-200"
          style={{ color: `${fontColor}80` }}
          onClick={() => setIsKanbanOpen(!isKanbanOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen && (
            <div className="flex items-center justify-between">
              <span>Kanban Boards</span>
              <IoIosArrowForward
                className={`w-4 h-4 transition-transform duration-300 ${
                  isKanbanOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          )}
        </motion.div>
        <AnimatePresence>
          {isKanbanOpen && isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="ml-4"
            >
              {kanbanItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <NavLink
                    to={item.to}
                    className={navLinkClass}
                    style={activeStyle}
                    aria-label={item.label}
                    onClick={() =>
                      isMobileMenuOpen && setIsMobileMenuOpen(false)
                    }
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {isOpen && <span>{item.label}</span>}
                    {!isOpen && (
                      <span
                        className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-lg"
                        style={{ backgroundColor: customColor }}
                      >
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Section */}
        <div
          className="px-3 py-2 mt-4 text-xs uppercase tracking-wide font-semibold"
          style={{ color: `${fontColor}80` }}
        >
          {isOpen ? "Main" : ""}
        </div>
        {navItems.map((item) => (
          <motion.div
            key={item.to}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink
              to={item.to}
              className={navLinkClass}
              style={activeStyle}
              aria-label={item.label}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
              {!isOpen && (
                <span
                  className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-lg"
                  style={{ backgroundColor: customColor }}
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          </motion.div>
        ))}

        {/* Charts Section */}
        <div
          className="px-3 py-2 mt-4 text-xs uppercase tracking-wide font-semibold"
          style={{ color: `${fontColor}80` }}
        >
          {isOpen ? "Charts" : ""}
        </div>
        {chartItems.map((item) => (
          <motion.div
            key={item.to}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink
              to={item.to}
              className={navLinkClass}
              style={activeStyle}
              aria-label={item.label}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
              {!isOpen && (
                <span
                  className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-lg"
                  style={{ backgroundColor: customColor }}
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          </motion.div>
        ))}

        {/* Admin Section */}
        <div
          className="px-3 py-2 mt-4 text-xs uppercase tracking-wide font-semibold"
          style={{ color: `${fontColor}80` }}
        >
          {isOpen ? "Admin" : ""}
        </div>
        {adminItems.map((item) => (
          <motion.div
            key={item.to}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink
              to={item.to}
              className={navLinkClass}
              style={activeStyle}
              aria-label={item.label}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
              {!isOpen && (
                <span
                  className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 shadow-lg"
                  style={{ backgroundColor: customColor }}
                >
                  {item.label}
                </span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
