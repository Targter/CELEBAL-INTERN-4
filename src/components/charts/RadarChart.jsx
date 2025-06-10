import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/Themecontext";
import { format } from "date-fns";
import ChartsHeader from "./ChartsHeaders";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ chartId = `radar-chart-${Date.now()}` }) => {
  const { batchReportData, batches, projects, isContextReady } =
    useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("RadarChart - Context Ready:", isContextReady);
    console.log("RadarChart - Batches:", batches);
    console.log("RadarChart - Batch Report Data:", batchReportData);
    const timer = setTimeout(() => {
      console.log("RadarChart - Setting isReady to true");
      setIsReady(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [isContextReady, batches, batchReportData]);

  const radarChartData = useMemo(() => {
    try {
      if (!isContextReady || !batchReportData || !batches || !projects) {
        console.log("RadarChart - Missing context data");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const selectedProject = projects[0];
      const projectBatches = batches.filter(
        (b) => b.projectId === selectedProject.id
      );

      const dataSource = projectBatches.map((batch) => {
        const batchData = batchReportData.filter(
          (report) => report.batchId === batch.id
        );
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
        };
      });

      // Calculate metrics
      const totalTasks = dataSource.reduce(
        (sum, d) => sum + d.completed + d.inProgress + d.todo,
        0
      );
      const totalCompleted = dataSource.reduce(
        (sum, d) => sum + d.completed,
        0
      );
      const avgTasksPerBatch = projectBatches.length
        ? totalTasks / projectBatches.length
        : 0;
      const lastUpdated = format(new Date(), "MMM dd, yyyy");

      console.log("RadarChart - DataSource:", dataSource);

      if (!dataSource.length || !totalTasks) {
        console.log("RadarChart - No data available");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const chartData = {
        labels: ["Completed", "In Progress", "To Do"],
        datasets: dataSource.map((d, index) => ({
          label: d.batchName,
          data: [d.completed, d.inProgress, d.todo],
          backgroundColor: [
            `${customColor || "#34d399"}33`,
            "#f59e0b33",
            "#ef444433",
          ][index % 3],
          borderColor: [customColor || "#34d399", "#f59e0b", "#ef4444"][
            index % 3
          ],
          borderWidth: 2,
          fill: true,
        })),
      };

      const csvData = [
        ...dataSource.map((d) => ({
          Batch: d.batchName,
          Completed: d.completed,
          "In Progress": d.inProgress,
          ToDo: d.todo,
        })),
        {},
        {
          Batch: "Metrics",
          Completed: "",
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Total Tasks",
          Completed: totalTasks,
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Total Completed",
          Completed: totalCompleted,
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Average Tasks per Batch",
          Completed: avgTasksPerBatch.toFixed(2),
          "In Progress": "",
          ToDo: "",
        },
        {
          Batch: "Last Updated",
          Completed: lastUpdated,
          "In Progress": "",
          ToDo: "",
        },
      ];

      console.log("RadarChart - ChartData:", chartData);

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
      console.error("RadarChart - Error:", err);
      setError(err.message);
      return { chartData: null, csvData: [], metrics: {} };
    }
  }, [batchReportData, batches, projects, isContextReady, customColor]);

  const chartOptions = {
    plugins: {
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
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: `${fontColor || "#e5e7eb"}33`,
        },
        grid: {
          color: `${fontColor || "#e5e7eb"}33`,
        },
        pointLabels: {
          color: fontColor || "#333333",
        },
        ticks: {
          color: fontColor || "#333333",
          backdropColor: "transparent",
          beginAtZero: true,
          stepSize: 1,
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
        <ChartsHeader category="Radar" title="Batch Task Comparison" />
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

  if (!isReady || !isContextReady || !radarChartData.chartData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Radar" title="Batch Task Comparison" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-sm"
          style={{ color: `${fontColor}aa` }}
        >
          {isContextReady
            ? "No task data available for the Website Redesign project."
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
          category="Radar"
          title="Task Comparison - Website Redesign"
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Compare task statuses (Completed, In Progress, To Do) across batches
          for the Website Redesign project. This chart highlights task
          distribution for each batch.
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
          data={radarChartData.csvData}
          filename="radar-report-website-redesign.csv"
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
        <Radar
          id={chartId}
          data={radarChartData.chartData}
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
            {radarChartData.metrics.totalTasks}
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
            {radarChartData.metrics.totalCompleted}
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
            {radarChartData.metrics.avgTasksPerBatch.toFixed(2)}
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
            {radarChartData.metrics.lastUpdated}
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
          Export data as CSV for batch task analysis. Data reflects tasks for
          the Website Redesign project.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(RadarChart);
