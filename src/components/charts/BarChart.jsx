import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/TC";
import ChartsHeader from "./ChartsHeaders";
import { format } from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ selectedBatchId = null }) => {
  const { batchReportData, selectedBatch, members } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, [batchReportData, selectedBatch]);

  const { chartData, csvData, metrics } = useMemo(() => {
    const batchId = selectedBatchId || selectedBatch?.id;
    const filteredData = batchReportData.filter(
      (report) => !batchId || report.batchId === batchId
    );

    const memberNames = filteredData.map(
      (report) =>
        members.find((m) => m.id === report.memberId)?.name || "Unknown"
    );

    const completed = filteredData.map((r) => r.tasksCompleted);
    const inProgress = filteredData.map((r) => r.tasksInProgress);
    const todo = filteredData.map((r) => r.tasksTodo);

    // Calculate metrics
    const totalTasks = filteredData.reduce(
      (sum, r) => sum + r.tasksCompleted + r.tasksInProgress + r.tasksTodo,
      0
    );
    const completedTasks = filteredData.reduce(
      (sum, r) => sum + r.tasksCompleted,
      0
    );
    const uniqueMembers = new Set(filteredData.map((r) => r.memberId)).size;
    const avgTasksPerMember = uniqueMembers ? totalTasks / uniqueMembers : 0;
    const lastUpdated = format(new Date(), "MMM dd, yyyy");

    const csvData = [
      ...memberNames.map((name, i) => ({
        Member: name,
        Completed: completed[i],
        "In Progress": inProgress[i],
        "To Do": todo[i],
      })),
      {},

      {
        Member: "Metrics",
        Completed: "",
        "In Progress": "",
        "To Do": "",
      },
      {
        Member: "Total Tasks",
        Completed: totalTasks,
        "In Progress": "",
        "To Do": "",
      },
      {
        Member: "Completed Tasks",
        Completed: completedTasks,
        "In Progress": "",
        "To Do": "",
      },
      {
        Member: "Average Tasks per Member",
        Completed: avgTasksPerMember.toFixed(2),
        "In Progress": "",
        "To Do": "",
      },
      {
        Member: "Last Updated",
        Completed: lastUpdated,
        "In Progress": "",
        "To Do": "",
      },
    ];

    const chartData = {
      labels: memberNames,
      datasets: [
        {
          label: "Completed",
          data: completed,
          backgroundColor: customColor || "#34d399",
        },
        {
          label: "In Progress",
          data: inProgress,
          backgroundColor: "#f59e0b",
        },
        {
          label: "To Do",
          data: todo,
          backgroundColor: "#ef4444",
        },
      ],
    };

    return {
      chartData,
      csvData,
      metrics: {
        totalTasks,
        completedTasks,
        avgTasksPerMember,
        lastUpdated,
      },
    };
  }, [batchReportData, selectedBatch, selectedBatchId, members, customColor]);

  if (!isReady || chartData.labels.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader category="Bar" title="Task Status Overview" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center text-sm"
          style={{ color: `${fontColor}aa` }}
        >
          No task data available for the selected batch. Try selecting a
          different batch or adding tasks.
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
          category="Bar"
          title={
            selectedBatch
              ? `Task Status Overview - ${selectedBatch.name}`
              : "Team Task Status Overview"
          }
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Visualize task distribution across team members, showing tasks in "To
          Do", "In Progress", and "Completed" statuses for the selected batch or
          entire team.
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
          filename={`bar-report-${selectedBatch?.id || "team"}.csv`}
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
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top", labels: { color: fontColor } },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: "Team Members",
                  color: fontColor,
                },
                ticks: { color: `${fontColor}aa` },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Task Count",
                  color: fontColor,
                },
                ticks: { color: `${fontColor}aa`, stepSize: 1 },
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
            Avg. Tasks per Member
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {metrics.avgTasksPerMember.toFixed(2)}
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
          Export data as CSV to analyze task assignments. Data reflects tasks
          for the {selectedBatch ? "selected batch" : "entire team"}.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(BarChart);
