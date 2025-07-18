import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Batches from "./pages/Batches";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./context/TC";
import { AppProvider } from "./context/AppContext";
import ThemeSwitcher from "./components/ThemeSwitcher";
// import { useTheme } from "./context/Themecontext";
import Profiles from "./pages/Profiles";
import "./App.css";
// import BarChart from "./components/charts/BarChart";
import BarChart from "./components/charts/BarChart";
import StackChart from "./components/charts/StackChart";
import PieChart from "./components/charts/PieChart";
import LineChart from "./components/charts/LineChart";
import DoughnutChart from "./components/charts/DoughnutChart";
import RadarChart from "./components/charts/RadarChart";
import PolarAreaChart from "./components/charts/PolarAreaChart";
import AreaChart from "./components/charts/AreaChart"; // Ensure this file exists
import Charts from "./components/charts/CC";
import KanbanBoard from "./components/KanbanBoard";
import AdminProfile from "./pages/AdminProfile";
import KanbanBoardd from "./pages/KanbanBoard";
import CustomCalender from "./components/CustomCalender";
import HomePagee from "./pages/HP";
// import Editorr from "./pages/Editor";
const App = () => {
  const { backgroundColor, fontColor, customColor } = useTheme();
  return (
    <Router>
      <ToastContainer autoClose={2000} />
      {/* <ThemeProvider> */}
      <AppProvider>
        <div
          className="flex min-h-screen transition-colors duration-300"
          style={{ backgroundColor, color: customColor }}
        >
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <ThemeSwitcher />
            </div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/batches" element={<Batches />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/calenders" element={<CustomCalender />} />
              <Route path="/charts" element={<Charts />} />
              {/* Individual chart routes */}
              <Route path="/charts/bar" element={<BarChart />} />
              <Route path="/charts/stack" element={<StackChart />} />
              <Route path="/charts/pie" element={<PieChart />} />
              <Route path="/charts/line" element={<LineChart />} />
              <Route path="/charts/doughnut" element={<DoughnutChart />} />
              <Route path="/charts/radar" element={<RadarChart />} />
              <Route path="/charts/polar" element={<PolarAreaChart />} />
              <Route path="/charts/area" element={<AreaChart />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/Admin" element={<AdminProfile />} />
              <Route path="/kanban2" element={<KanbanBoardd />} />

              <Route path="/hp" element={<HomePagee />} />
              {/* import Editors */}
            </Routes>
          </main>
        </div>
      </AppProvider>
      {/* // </ThemeProvider> */}
    </Router>
  );
};

export default App;

/*        <Route path="/editor" element={<Editorr />} /> */
