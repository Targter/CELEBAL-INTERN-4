import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/Themecontext";
import { format, subMonths, startOfMonth } from "date-fns";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { CSVLink } from "react-csv";
import ChartsHeader from "./ChartsHeaders";

// Register chart components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Filler,
  Legend
);

const AreaChart = ({ selectedMemberId = null }) => {
  const { tasks, selectedBatch, members, lastSelectedDate } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, [tasks, selectedBatch, lastSelectedDate]);

  const { chartData, csvData, metrics } = useMemo(() => {
    const filteredTasks = tasks.filter((task) => {
      if (selectedBatch && task.batchId !== selectedBatch.id) return false;
      if (selectedMemberId && !task.assignedTo.includes(selectedMemberId))
        return false;
      if (lastSelectedDate) {
        const taskMonth = format(new Date(task.dueDate), "yyyy-MM");
        const selectedMonth = format(lastSelectedDate, "yyyy-MM");
        return taskMonth === selectedMonth;
      }
      return true;
    });

    const taskSummary = filteredTasks.reduce((acc, task) => {
      const month = format(new Date(task.dueDate), "yyyy-MM");
      if (!acc[month]) acc[month] = { completed: 0, total: 0 };
      acc[month].total += 1;
      if (task.status === "Done") acc[month].completed += 1;
      return acc;
    }, {});

    const startDate = startOfMonth(subMonths(new Date(2025, 3), 6));
    const endDate = startOfMonth(new Date(2025, 3));
    const months = [];
    let current = startDate;
    while (current <= endDate) {
      months.push(format(current, "yyyy-MM"));
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    const labels = months.map((m) => new Date(m + "-01"));
    const dataPoints = months.map((month) => {
      const info = taskSummary[month];
      return info ? (info.completed / info.total) * 100 : 0;
    });

    // Calculate metrics
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(
      (t) => t.status === "Done"
    ).length;
    const avgCompletionRate =
      dataPoints.reduce((sum, rate) => sum + rate, 0) /
        dataPoints.filter((rate) => rate > 0).length || 0;
    const lastUpdated = lastSelectedDate
      ? format(lastSelectedDate, "MMM dd, yyyy")
      : format(new Date(), "MMM dd, yyyy");

    const csvData = [
      ...labels.map((date, i) => ({
        Date: format(date, "yyyy-MM-dd"),
        "Completion Rate (%)": dataPoints[i].toFixed(2),
      })),
      {},
      {
        Date: "Metrics",
        "Completion Rate (%)": "",
      },
      {
        Date: "Total Tasks",
        "Completion Rate (%)": totalTasks,
      },
      {
        Date: "Completed Tasks",
        "Completion Rate (%)": completedTasks,
      },
      {
        Date: "Average Completion Rate (%)",
        "Completion Rate (%)": avgCompletionRate.toFixed(2),
      },
      {
        Date: "Last Updated",
        "Completion Rate (%)": lastUpdated,
      },
    ];

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: "Completion Rate (%)",
            data: dataPoints,
            fill: true,
            backgroundColor: `${customColor}33`,
            borderColor: customColor,
            tension: 0.4,
            pointRadius: 3,
          },
        ],
      },
      csvData,
      metrics: {
        totalTasks,
        completedTasks,
        avgCompletionRate,
        lastUpdated,
      },
    };
  }, [tasks, selectedBatch, selectedMemberId, lastSelectedDate, customColor]);

  if (!isReady || !chartData.datasets[0].data.some((d) => d > 0)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Area" title="Task Completion Trend" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-sm"
          style={{ color: `${fontColor}aa` }}
        >
          No task data available for the selected filters. Try adjusting the
          batch, member, or date range.
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
          category="Area"
          title={
            selectedMemberId
              ? `Task Completion Trend - ${
                  members.find((m) => m.id === selectedMemberId)?.name ||
                  "Member"
                }`
              : selectedBatch
              ? `Task Completion Trend - ${selectedBatch.name}`
              : "Team Task Completion Trend"
          }
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Track task completion rates over time for your team, batch, or
          individual members. This chart shows the percentage of tasks marked as
          "Done" each month.
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
          data={csvData}
          filename={`area-report-${
            selectedMemberId || selectedBatch?.id || "team"
          }.csv`}
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
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                type: "time",
                time: { unit: "month", tooltipFormat: "MMM yyyy" },
                title: {
                  display: true,
                  text: "Month",
                  color: fontColor,
                },
                ticks: { color: `${fontColor}aa` },
              },
              y: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: "Completion Rate (%)",
                  color: fontColor,
                },
                ticks: { color: `${fontColor}aa`, stepSize: 20 },
              },
            },
          }}
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
            {metrics.totalTasks}
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
            {metrics.completedTasks}
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
            Avg. Completion Rate
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {metrics.avgCompletionRate.toFixed(2)}%
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
            {metrics.lastUpdated}
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
          Export data as CSV for detailed analysis. Data reflects tasks assigned
          to the{" "}
          {selectedMemberId
            ? "selected member"
            : selectedBatch
            ? "selected batch"
            : "entire team"}{" "}
          within the chosen timeframe.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(AreaChart);
