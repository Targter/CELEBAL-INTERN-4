import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import Tables from "./Tables";
import Charts from "../components/Charts";
// import CustomCalender from "../components/CustomCalender";
// import KanbanBoard from "../components/KanbanBoard";
import Board from "./KanbanBoard";
import { useAppContext } from "../context/AppContext";
import ProjectModal from "../components/ProjectModal";
import BatchModal from "../components/BatchModal";
import TaskModal from "../components/TaskModal";
import { FaTasks, FaProjectDiagram, FaUsers } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Disclaimer from "../components/Disclaimer";

const Dashboard = () => {
  const {
    selectTask,
    selectBatch,
    batchReportData,
    projects,
    batches,
    tasks,
    members,
    selectedBatch,
    selectedTask,
    selectProject,
    selectedProject,
  } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = useMemo(() => {
    const activeProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    const activeBatches = batches.length;
    const totalMembers = members.length;
    const completionRate =
      (batchReportData.reduce((sum, r) => sum + r.tasksCompleted, 0) /
        batchReportData.reduce(
          (sum, r) =>
            sum + (r.tasksCompleted + r.tasksInProgress + r.tasksTodo),
          1
        )) *
      100;

    return {
      activeProjects,
      totalTasks,
      completedTasks,
      activeBatches,
      totalMembers,
      completionRate: completionRate.toFixed(2),
    };
  }, [projects, tasks, batches, members, batchReportData]);

  const handleSelectTask = (task) => {
    selectTask(task);
    const batch = batches.find((b) => b.id === task.batchId);
    if (batch) {
      selectBatch(batch);
      setReportType("task");
      toast.success(`Selected task: ${task.name} (Batch: ${batch.name})`, {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: backgroundColor,
          color: fontColor,
        },
      });
    } else {
      toast.error("No batch found for this task", {
        position: "top-right",
        autoClose: 3000,
        style: {
          background: backgroundColor,
          color: fontColor,
        },
      });
    }
  };

  const handleSelectBatch = (batch) => {
    selectBatch(batch);
    setReportType("batch");
    toast.info(`Selected batch: ${batch.name}`, {
      position: "top-right",
      autoClose: 3000,
      style: {
        background: backgroundColor,
        color: fontColor,
      },
    });
  };

  const handleSelectProject = (project) => {
    selectProject(project);
    setReportType("project");
    selectBatch(null);
    toast.info(`Selected project: ${project.name}`, {
      position: "top-right",
      autoClose: 3000,
      style: {
        background: backgroundColor,
        color: fontColor,
      },
    });
  };

  const clearSelection = () => {
    selectTask(null);
    selectBatch(null);
    selectProject(null);
    setReportType(null);
    toast.info("Selection cleared", {
      position: "top-right",
      autoClose: 3000,
      style: {
        background: backgroundColor,
        color: fontColor,
      },
    });
  };

  console.log("Dashboard State:", {
    selectedTask,
    selectedBatch,
    selectedProject,
    reportType,
  });

  return (
    <>
      {/* <ToastContainer /> */}
      {windowWidth > 700 && <Disclaimer />}
      {/* <Disclaimer /> Existing Disclaimer, retained for compatibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
        style={{ backgroundColor, color: fontColor }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white"
            style={{ color: customColor, backgroundColor }}
          >
            Admin Panel
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowProjectModal(true)}
              className="text-white px-4 py-2 rounded-lg bg-opacity-20 hover:bg-opacity-90 cursor-pointer"
              style={{ backgroundColor: customColor }}
            >
              Add Project
            </button>
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-4 text-white py-2 rounded-lg hover:bg-opacity-90 cursor-pointer"
              style={{ backgroundColor: customColor }}
            >
              Add Batch
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className=" px-4 py-2 text-white rounded-lg hover:bg-opacity-90 cursor-pointer"
              style={{ backgroundColor: customColor }}
            >
              Add Task
            </button>
            {(selectedBatch || selectedProject || selectedTask) && (
              <button
                onClick={clearSelection}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          style={{ backgroundColor }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-theme hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            style={{ backgroundColor, color: fontColor }}
          >
            <div className="flex items-center space-x-4">
              <svg
                className="w-8 h-8 text-theme"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div>
                <h2
                  className="text-lg font-semibold text-gray-700 dark:text-gray-200"
                  style={{ color: fontColor }}
                >
                  Total Projects
                </h2>
                <p
                  className="mt-2 text-3xl font-bold text-theme"
                  style={{ color: fontColor }}
                >
                  {projects.length}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-theme hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            style={{ backgroundColor, color: fontColor }}
          >
            <div className="flex items-center space-x-4">
              <svg
                className="w-8 h-8 text-theme"
                fill="none"
                stroke="currentColor"
                viewBox="0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <div>
                <h2
                  className="text-lg font-semibold dark:text-gray-200 text-theme"
                  style={{ color: fontColor }}
                >
                  Active Batches
                </h2>
                <p className="mt-2 text-3xl font-bold text-theme">
                  {batches.length}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-theme hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            style={{ backgroundColor, color: fontColor }}
          >
            <div className="flex items-center space-x-4">
              <svg
                className="w-8 h-8 text-theme"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4h-10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h2
                  className="text-lg font-semibold text-gray-700 dark:text-gray-200"
                  style={{ color: fontColor }}
                >
                  Total Tasks
                </h2>
                <p className="mt-2 text-3xl font-bold text-theme">
                  {tasks.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ backgroundColor, color: fontColor }}
          >
            <h2
              className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4"
              style={{ backgroundColor, color: customColor }}
            >
              Task List
            </h2>
            <div className="overflow-x-auto">
              <Tables
                onSelectTask={handleSelectTask}
                onSelectProject={handleSelectProject}
                onSelectBatch={handleSelectBatch}
              />
            </div>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ backgroundColor, color: fontColor }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200"
                  style={{ backgroundColor, color: customColor }}
                >
                  {reportType === "project"
                    ? `Project Reports - ${selectedProject?.name || ""}`
                    : `Batch Reports - ${
                        selectedBatch?.name || "No Selection"
                      }`}
                </h2>
                {(selectedBatch || selectedProject || selectedTask) && (
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              {reportType === "project" && selectedProject ? (
                <Charts
                  chartId={`dashboard-project-chart-${selectedProject.id}`}
                  projectId={selectedProject.id}
                />
              ) : selectedBatch ? (
                <Charts
                  chartId={`dashboard-batch-chart-${selectedBatch.id}`}
                  batchId={selectedBatch.id}
                />
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Please select a task, batch, or project to view its report.
                </p>
              )}
            </motion.div>
            {/* <CustomCalender /> */}
          </div>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ backgroundColor, color: fontColor }}
        >
          <h2
            className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4"
            style={{ color: fontColor }}
          >
            Task Progress Board
          </h2>
          <Board />
        </motion.div>

        {showProjectModal && (
          <ProjectModal onClose={() => setShowProjectModal(false)} />
        )}
        {showBatchModal && (
          <BatchModal onClose={() => setShowBatchModal(false)} />
        )}
        {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} />}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="rounded-xl shadow-lg p-4">
          <Charts chartId="dashboard-chart" />
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
