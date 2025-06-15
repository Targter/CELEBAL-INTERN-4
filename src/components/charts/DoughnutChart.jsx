import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { format } from "date-fns";
import ChartsHeader from "./ChartsHeaders";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ chartId = `doughnut-chart-${Date.now()}` }) => {
  const { tasks, selectedBatch, isContextReady } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("DoughnutChart - Context Ready:", isContextReady);
    console.log("DoughnutChart - Selected Batch:", selectedBatch);
    console.log("DoughnutChart - Tasks:", tasks);
    const timer = setTimeout(() => {
      console.log("DoughnutChart - Setting isReady to true");
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isContextReady, selectedBatch, tasks]);

  const doughnutChartData = useMemo(() => {
    try {
      if (!isContextReady || !tasks) {
        console.log("DoughnutChart - Missing context data");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const filteredTasks = tasks.filter(
        (task) => !selectedBatch || task.batchId === selectedBatch.id
      );

      console.log("DoughnutChart - Filtered Tasks:", filteredTasks);

      const priorityCounts = filteredTasks.reduce(
        (acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        },
        { High: 0, Medium: 0, Low: 0 }
      );

      const totalTasks =
        priorityCounts.High + priorityCounts.Medium + priorityCounts.Low;
      const highPriorityPercentage = totalTasks
        ? ((priorityCounts.High / totalTasks) * 100).toFixed(2)
        : 0;
      const mediumPriorityPercentage = totalTasks
        ? ((priorityCounts.Medium / totalTasks) * 100).toFixed(2)
        : 0;
      const lowPriorityPercentage = totalTasks
        ? ((priorityCounts.Low / totalTasks) * 100).toFixed(2)
        : 0;
      const lastUpdated = format(new Date(), "MMM dd, yyyy");

      const dataSource = [
        { label: "High Priority", value: priorityCounts.High },
        { label: "Medium Priority", value: priorityCounts.Medium },
        { label: "Low Priority", value: priorityCounts.Low },
      ].filter((d) => d.value > 0);

      console.log("DoughnutChart - DataSource:", dataSource);

      if (!dataSource.length) {
        console.log("DoughnutChart - No data available");
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
          Priority: d.label,
          Count: d.value,
        })),
        {},
        {
          Priority: "Metrics",
          Count: "",
        },
        {
          Priority: "Total Tasks",
          Count: totalTasks,
        },
        {
          Priority: "High Priority Tasks",
          Count: priorityCounts.High,
        },
        {
          Priority: "High Priority (%)",
          Count: highPriorityPercentage,
        },
        {
          Priority: "Medium Priority (%)",
          Count: mediumPriorityPercentage,
        },
        {
          Priority: "Low Priority (%)",
          Count: lowPriorityPercentage,
        },
        {
          Priority: "Last Updated",
          Count: lastUpdated,
        },
      ];

      console.log("DoughnutChart - ChartData:", chartData);

      return {
        chartData,
        csvData,
        metrics: {
          totalTasks,
          highPriorityTasks: priorityCounts.High,
          highPriorityPercentage,
          mediumPriorityPercentage,
          lowPriorityPercentage,
          lastUpdated,
        },
      };
    } catch (err) {
      console.error("DoughnutChart - Error:", err);
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
    cutout: "60%",
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
        <ChartsHeader category="Doughnut" title="Task Priority Distribution" />
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

  if (!isReady || !isContextReady || !doughnutChartData.chartData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Doughnut" title="Task Priority Distribution" />
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
      {/* Header and description */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ChartsHeader
          category="Tasks"
          title={
            selectedBatch
              ? `Task Priority Distribution - ${selectedBatch.name}`
              : "Batch Task Priority Distribution"
          }
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Analyze the distribution of tasks by priority (High, Medium, Low) for
          the selected batch or entire team. This chart highlights the
          proportion of tasks at each priority level.
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
          data={doughnutChartData.csvData}
          filename={`doughnut-report-${selectedBatch?.id || "team"}.csv`}
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
        <Doughnut
          id={chartId}
          data={doughnutChartData.chartData}
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
            {doughnutChartData.metrics.totalTasks}
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
            High Priority Tasks
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {doughnutChartData.metrics.highPriorityTasks} (
            {doughnutChartData.metrics.highPriorityPercentage}%)
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
            Medium Priority (%)
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {doughnutChartData.metrics.mediumPriorityPercentage}%
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
            {doughnutChartData.metrics.lastUpdated}
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
          Export data as CSV for priority analysis. Data reflects tasks for the{" "}
          {selectedBatch ? "selected batch" : "entire team"}.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(DoughnutChart);
