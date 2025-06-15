import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/TC";
import { format } from "date-fns";
import ChartsHeader from "./ChartsHeaders";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackChart = ({ chartId = `stack-chart-${Date.now()}` }) => {
  const { batchReportData, batches, projects, isContextReady } =
    useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("StackChart - Context Ready:", isContextReady);
    console.log("StackChart - Batches:", batches);
    console.log("StackChart - Batch Report Data:", batchReportData);
    const timer = setTimeout(() => {
      console.log("StackChart - Setting isReady to true");
      setIsReady(true);
    }, 800); // Reduced delay
    return () => clearTimeout(timer);
  }, [isContextReady, batches, batchReportData]);

  const stackChartData = useMemo(() => {
    try {
      if (!isContextReady || !batchReportData || !batches || !projects) {
        console.log("StackChart - Missing context data");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const dataSource = batches.map((batch) => {
        const batchData = batchReportData.filter(
          (report) => report.batchId === batch.id
        );
        const project = projects.find((p) => p.id === batch.projectId);
        const completed = batchData.reduce(
          (sum, r) => sum + (r.tasksCompleted || 0),
          0
        );
        const inProgress = batchData.reduce(
          (sum, r) => sum + (r.tasksInProgress || 0),
          0
        );
        const todo = batchData.reduce((sum, r) => sum + (r.tasksTodo || 0), 0);
        return {
          batchName: batch.name,
          completed,
          inProgress,
          todo,
          projectName: project?.name || "Unknown",
        };
      });

      // Calculate
      const totalTasks = dataSource.reduce(
        (sum, d) => sum + d.completed + d.inProgress + d.todo,
        0
      );
      const totalCompleted = dataSource.reduce(
        (sum, d) => sum + d.completed,
        0
      );
      const avgTasksPerBatch = batches.length ? totalTasks / batches.length : 0;
      const lastUpdated = format(new Date(), "MMM dd, yyyy");

      console.log("StackChart - DataSource:", dataSource);

      if (!dataSource.length || !totalTasks) {
        console.log("StackChart - No data available");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const chartData = {
        labels: dataSource.map((d) => d.batchName),
        datasets: [
          {
            label: "Completed",
            data: dataSource.map((d) => d.completed),
            backgroundColor: customColor || "#34d399",
            stack: "Stack 0",
          },
          {
            label: "In Progress",
            data: dataSource.map((d) => d.inProgress),
            backgroundColor: "#f59e0b",
            stack: "Stack 0",
          },
          {
            label: "To Do",
            data: dataSource.map((d) => d.todo),
            backgroundColor: "#ef4444",
            stack: "Stack 0",
          },
        ],
      };

      const csvData = [
        ...dataSource.map((d) => ({
          Batch: d.batchName,
          Project: d.projectName,
          Completed: d.completed,
          "In Progress": d.inProgress,
          ToDo: d.todo,
        })),
        {},
        {
          Batch: "Metrics",
          Project: "",
          Completed: "",
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Total Tasks",
          Project: "",
          Completed: totalTasks,
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Total Completed",
          Project: "",
          Completed: totalCompleted,
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Average Tasks per Batch",
          Project: "",
          Completed: avgTasksPerBatch.toFixed(2),
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Last Updated",
          Project: "",
          Completed: lastUpdated,
          "In Progress": "",
          ToDo: "",
        },
      ];

      console.log("StackChart - ChartData:", chartData);

      return {
        chartData,
        csvData,
        metrics: {
          totalTasks,
          totalCompleted,
          avgTasksPerBatch,
          lastUpdated,
        },
      };
    } catch (err) {
      console.error("StackChart - Error:", err);
      setError(err.message);
      return { chartData: null, csvData: [], metrics: {} };
    }
  }, [batchReportData, batches, projects, isContextReady, customColor]);

  const chartOptions = {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: fontColor || "#333333",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Batches",
          color: fontColor || "#333333",
        },
        ticks: {
          color: `${fontColor || "#333333"}aa`,
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Task Count",
          color: fontColor || "#333333",
        },
        ticks: {
          color: `${fontColor || "#333333"}aa`,
          beginAtZero: true,
          stepSize: 1,
        },
        grid: {
          color: `${fontColor || "#e5e7eb"}33`,
        },
      },
    },
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
        <ChartsHeader category="Stack" title="Batch Task Overview" />
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

  if (!isReady || !isContextReady || !stackChartData.chartData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Stack" title="Batch Task Overview" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-sm"
          style={{ color: `${fontColor}aa` }}
        >
          {isContextReady
            ? "No task data available for the batches. Try adding tasks or checking batch reports."
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
        <ChartsHeader category="Stack" title="Tasks by Batch" />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Visualize the distribution of tasks (Completed, In Progress, To Do)
          across batches for all projects. This stacked bar chart shows task
          counts per batch.
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
          data={stackChartData.csvData}
          filename="stack-batch-report.csv"
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
        <Bar
          id={chartId}
          data={stackChartData.chartData}
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
            {stackChartData.metrics.totalTasks}
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
            {stackChartData.metrics.totalCompleted}
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
            Avg. Tasks per Batch
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {stackChartData.metrics.avgTasksPerBatch.toFixed(2)}
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
            {stackChartData.metrics.lastUpdated}
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
          Export data as CSV for batch task analysis. Data reflects tasks across
          all batches and projects.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(StackChart);
