import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/Themecontext";
import { format } from "date-fns";
import ChartsHeader from "./ChartsHeaders";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartId = `pie-chart-${Date.now()}` }) => {
  const { tasks, selectedBatch, isContextReady } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("PieChart - Context Ready:", isContextReady);
    console.log("PieChart - Selected Batch:", selectedBatch);
    console.log("PieChart - Tasks:", tasks);
    const timer = setTimeout(() => {
      console.log("PieChart - Setting isReady to true");
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isContextReady, selectedBatch, tasks]);

  const pieChartData = useMemo(() => {
    try {
      if (!isContextReady || !tasks) {
        console.log("PieChart - Missing context data");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const filteredTasks = tasks.filter(
        (task) => !selectedBatch || task.batchId === selectedBatch.id
      );

      console.log("PieChart - Filtered Tasks:", filteredTasks);

      const statusCounts = filteredTasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { Done: 0, "In Progress": 0, "To Do": 0 }
      );

      const totalTasks =
        statusCounts.Done + statusCounts["In Progress"] + statusCounts["To Do"];
      const completedPercentage = totalTasks
        ? ((statusCounts.Done / totalTasks) * 100).toFixed(2)
        : 0;
      const inProgressPercentage = totalTasks
        ? ((statusCounts["In Progress"] / totalTasks) * 100).toFixed(2)
        : 0;
      const todoPercentage = totalTasks
        ? ((statusCounts["To Do"] / totalTasks) * 100).toFixed(2)
        : 0;
      const lastUpdated = format(new Date(), "MMM dd, yyyy");

      const dataSource = [
        { label: "Completed", value: statusCounts.Done },
        { label: "In Progress", value: statusCounts["In Progress"] },
        { label: "To Do", value: statusCounts["To Do"] },
      ].filter((d) => d.value > 0);

      console.log("PieChart - DataSource:", dataSource);

      if (!dataSource.length) {
        console.log("PieChart - No data available");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const chartData = {
        labels: dataSource.map((d) => d.label),
        datasets: [
          {
            data: dataSource.map((d) => d.value),
            backgroundColor: [customColor || "#34d399", "#f59e0b", "#ef4444"],
            borderColor: backgroundColor || "#ffffff",
            borderWidth: 1,
          },
        ],
      };

      const csvData = [
        ...dataSource.map((d) => ({
          Status: d.label,
          Count: d.value,
        })),
        {},
        {
          Status: "Metrics",
          Count: "",
        },
        {
          Status: "Total Tasks",
          Count: totalTasks,
        },
        {
          Status: "Completed Tasks",
          Count: statusCounts.Done,
        },
        {
          Status: "Completed (%)",
          Count: completedPercentage,
        },
        {
          Status: "In Progress (%)",
          Count: inProgressPercentage,
        },
        {
          Status: "To Do (%)",
          Count: todoPercentage,
        },
        {
          Status: "Last Updated",
          Count: lastUpdated,
        },
      ];

      console.log("PieChart - ChartData:", chartData);

      return {
        chartData,
        csvData,
        metrics: {
          totalTasks,
          completedTasks: statusCounts.Done,
          completedPercentage,
          inProgressPercentage,
          todoPercentage,
          lastUpdated,
        },
      };
    } catch (err) {
      console.error("PieChart - Error:", err);
      setError(err.message);
      return { chartData: null, csvData: [], metrics: {} };
    }
  }, [tasks, selectedBatch, isContextReady, customColor, backgroundColor]);

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: fontColor || "#1f2937",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Pie" title="Task Status Distribution" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-sm"
          style={{ color: `${fontColor}aa` }}
        >
          Error rendering chart: {error}
        </motion.p>
      </motion.div>
    );
  }

  if (!isReady || !isContextReady || !pieChartData.chartData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Pie" title="Task Status Distribution" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-sm"
          style={{ color: `${fontColor}aa` }}
        >
          {isContextReady
            ? "No task data available for the selected batch. Try selecting a different batch or adding tasks."
            : "Loading chart data..."}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 rounded-xl shadow-lg"
      style={{ backgroundColor }}
    >
      {/* Header and Description */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChartsHeader
          category="Pie"
          title={
            selectedBatch
              ? `Task Status Distribution - ${selectedBatch.name}`
              : "Team Task Status Distribution"
          }
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Visualize the distribution of tasks by status (Completed, In Progress,
          To Do) for the selected batch or entire team. This chart shows the
          proportion of tasks in each status.
        </p>
      </motion.div>

      {/* CSV Export */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end mb-4"
      >
        <CSVLink
          data={pieChartData.csvData}
          filename={`pie-report-${selectedBatch?.id || "team"}.csv`}
          className="px-4 py-2 rounded-lg text-white text-sm flex items-center"
          style={{ backgroundColor: customColor }}
        >
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Export CSV
          </motion.span>
        </CSVLink>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full h-[300px] sm:h-[350px]"
      >
        <Pie
          id={chartId}
          data={pieChartData.chartData}
          options={chartOptions}
        />
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
      >
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}cc`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            Total Tasks
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {pieChartData.metrics.totalTasks}
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}cc`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            Completed Tasks
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {pieChartData.metrics.completedTasks} (
            {pieChartData.metrics.completedPercentage}%)
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}cc`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            In Progress (%)
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {pieChartData.metrics.inProgressPercentage}%
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}cc`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            Last Updated
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {pieChartData.metrics.lastUpdated}
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-sm" style={{ color: `${fontColor}aa` }}>
          Export data as CSV for status analysis. Data reflects tasks for the{" "}
          {selectedBatch ? "selected batch" : "entire team"}.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(PieChart);
