import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/TC";
import { format, startOfMonth, subMonths } from "date-fns";
import ChartsHeader from "./ChartsHeaders";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartId = `line-chart-${Date.now()}` }) => {
  const { tasks, selectedBatch, isContextReady } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("LineChart - Context Ready:", isContextReady);
    console.log("LineChart - Selected Batch:", selectedBatch);
    console.log("LineChart - Tasks:", tasks);
    const timer = setTimeout(() => {
      console.log("LineChart - Setting isReady to true");
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isContextReady, selectedBatch, tasks]);

  const lineChartData = useMemo(() => {
    try {
      if (!isContextReady || !tasks) {
        console.log("LineChart - Missing context data");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const filteredTasks = tasks.filter(
        (task) => !selectedBatch || task.batchId === selectedBatch.id
      );

      console.log("LineChart - Filtered Tasks:", filteredTasks);

      const startDate = startOfMonth(subMonths(new Date(2025, 3), 6));
      const endDate = startOfMonth(new Date(2025, 3));
      const months = [];
      let current = startDate;
      while (current <= endDate) {
        months.push(format(current, "MMM yyyy"));
        current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      }

      const dataSource = months.map((month) => {
        const monthTasks = filteredTasks.filter(
          (t) => format(new Date(t.dueDate), "MMM yyyy") === month
        );
        const completed = monthTasks.filter((t) => t.status === "Done").length;
        return { month, completed };
      });

      console.log("LineChart - DataSource:", dataSource);

      // Calculate metrics
      const totalCompleted = dataSource.reduce(
        (sum, d) => sum + d.completed,
        0
      );
      const monthsWithData = dataSource.filter((d) => d.completed > 0).length;
      const avgCompletedPerMonth = monthsWithData
        ? totalCompleted / monthsWithData
        : 0;
      const peakMonth = dataSource.reduce(
        (max, d) => (d.completed > max.completed ? d : max),
        { month: "None", completed: 0 }
      );
      const lastUpdated = format(new Date(), "MMM dd, yyyy");

      if (!dataSource.length || totalCompleted === 0) {
        console.log("LineChart - No data available");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const chartData = {
        labels: dataSource.map((d) => d.month),
        datasets: [
          {
            label: "Completed Tasks",
            data: dataSource.map((d) => d.completed),
            borderColor: customColor || "#34d399",
            backgroundColor: `${customColor || "#34d399"}33`,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
          },
        ],
      };

      const csvData = [
        ...dataSource.map((d) => ({
          Month: d.month,
          Completed: d.completed,
        })),
        {},
        {
          Month: "Metrics",
          Completed: "",
        },
        {
          Month: "Total Completed Tasks",
          Completed: totalCompleted,
        },
        {
          Month: "Average Completed per Month",
          Completed: avgCompletedPerMonth.toFixed(2),
        },
        {
          Month: "Peak Month",
          Completed: `${peakMonth.month} (${peakMonth.completed})`,
        },
        {
          Month: "Last Updated",
          Completed: lastUpdated,
        },
      ];

      console.log("LineChart - ChartData:", chartData);

      return {
        chartData,
        csvData,
        metrics: {
          totalCompleted,
          avgCompletedPerMonth,
          peakMonth: peakMonth.month,
          peakMonthValue: peakMonth.completed,
          lastUpdated,
        },
      };
    } catch (err) {
      console.error("LineChart - Error:", err);
      setError(err.message);
      return { chartData: null, csvData: [], metrics: {} };
    }
  }, [tasks, selectedBatch, isContextReady, customColor]);

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
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          color: fontColor || "#1f2937",
        },
        ticks: {
          color: `${fontColor || "#1f2937"}aa`,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Completed Tasks",
          color: fontColor || "#1f2937",
        },
        ticks: {
          color: `${fontColor || "#1f2937"}aa`,
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
        <ChartsHeader category="Line" title="Task Completion Trend" />
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

  if (!isReady || !isContextReady || !lineChartData.chartData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Line" title="Task Completion Trend" />
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
          category="Line"
          title={
            selectedBatch
              ? `Task Completion Trend - ${selectedBatch.name}`
              : "Team Task Completion Trend"
          }
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Track the number of completed tasks over time for the selected batch
          or entire team. This chart shows monthly counts of tasks marked as
          "Done".
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
          data={lineChartData.csvData}
          filename={`line-report-${selectedBatch?.id || "team"}.csv`}
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
        <Line
          id={chartId}
          data={lineChartData.chartData}
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
            Total Completed Tasks
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {lineChartData.metrics.totalCompleted}
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
            Avg. Completed per Month
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {lineChartData.metrics.avgCompletedPerMonth.toFixed(2)}
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
            Peak Month
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {lineChartData.metrics.peakMonth} (
            {lineChartData.metrics.peakMonthValue})
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
            {lineChartData.metrics.lastUpdated}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 text-center"
      >
        <p className="text-sm" style={{ color: `${fontColor}aa` }}>
          Export data as CSV for trend analysis. Data reflects completed tasks
          for:
          {selectedBatch ? "selected batch" : "entire team"}.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(LineChart);
