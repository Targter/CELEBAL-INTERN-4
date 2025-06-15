import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/Themecontext";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaUserCircle,
  FaCalendarAlt,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaUserShield,
  FaTasks,
} from "react-icons/fa";
import { RiGroup2Fill } from "react-icons/ri";
import { PiKanbanFill } from "react-icons/pi";
import { PiChartPolarFill } from "react-icons/pi";
import { BiSolidDoughnutChart } from "react-icons/bi";
import { MdOutlineStackedBarChart } from "react-icons/md";
import { FaChartArea } from "react-icons/fa6";
import { TbChartRadar } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { backgroundColor, fontColor, customColor } = useTheme();

  // Handle window resize to adjust sidebar state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setIsOpen(false);
        // setIsMobileMenuOpen(false);
      } else if (width >= 640 && width < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-colors group relative ${
      isActive ? "text-white" : ""
    } hover:bg-opacity-80`;

  const activeStyle = ({ isActive }) =>
    isActive
      ? { backgroundColor: customColor, color: "#ffffff" }
      : { color: fontColor };

  const navItems = [
    { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/hp", label: "Dashboad-2", icon: <FaTachometerAlt /> },
    { to: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { to: "/batches", label: "Batches", icon: <FaUsers /> },
    { to: "/kanban", label: "Kanban Board", icon: <PiKanbanFill /> },
    { to: "/kanban2", label: "Kanban Board", icon: <PiKanbanFill /> },
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

  const Admin = [{ to: "/settings", label: "Settings", icon: <FaCog /> }];

  return (
    <div
      className={` h-full shadow-xl transition-all duration-300 z-50 bg-green-500 ${
        isOpen ? "w-64" : "w-16 sm:w-16"
      } ${isOpen ? "block" : "block sm:block"}`}
      style={{ backgroundColor }}
      aria-label="Sidebar Navigation"
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          // if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        }}
        className="p-4 w-full flex items-center justify-between"
        aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        style={{ color: fontColor }}
      >
        <IoIosArrowForward
          className={`w-6 h-6 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <nav className="space-y-1 px-2 mb-11">
        {/* Main Section */}
        <div
          className="px-3 py-1 text-xs uppercase tracking-wide font-semibold"
          style={{ color: `${fontColor}80` }}
        >
          {isOpen ? "Main" : ""}
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={navLinkClass}
            style={activeStyle}
            aria-label={item.label}
            // onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
            {!isOpen && (
              <span
                className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                style={{ backgroundColor: customColor }}
              >
                {item.label}
              </span>
            )}
          </NavLink>
        ))}

        {/* Charts Section */}
        <div
          className="px-3 py-2 mt-4 text-xs uppercase tracking-wide font-semibold"
          style={{ color: `${fontColor}80` }}
        >
          {isOpen ? "Charts" : ""}
        </div>
        {chartItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={navLinkClass}
            style={activeStyle}
            aria-label={item.label}
            // onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
            {!isOpen && (
              <span
                className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                style={{ backgroundColor: customColor }}
              >
                {item.label}
              </span>
            )}
          </NavLink>
        ))}

        {/* Admin SEction */}
        <div
          className="px-3 py-2 mt-4 text-xs uppercase tracking-wide font-semibold"
          style={{ color: `${fontColor}80` }}
        >
          {isOpen && "Admin"}
        </div>
        {Admin.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={navLinkClass}
            style={activeStyle}
            aria-label={item.label}
            // onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
            {!isOpen && (
              <span
                className="absolute left-16 bg-gray-800 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                style={{ backgroundColor: customColor }}
              >
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
