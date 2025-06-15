import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { CSVLink } from "react-csv";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/TC";
import { format } from "date-fns";
import ChartsHeader from "./ChartsHeaders";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarAreaChart = ({ chartId = `polar-area-chart-${Date.now()}` }) => {
  const { batchReportData, members, selectedBatch, isContextReady } =
    useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("PolarAreaChart - Context Ready:", isContextReady);
    console.log("PolarAreaChart - Selected Batch:", selectedBatch);
    console.log("PolarAreaChart - Batch Report Data:", batchReportData);
    const timer = setTimeout(() => {
      console.log("PolarAreaChart - Setting isReady to true");
      setIsReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isContextReady, selectedBatch, batchReportData]);

  const polarAreaChartData = useMemo(() => {
    try {
      if (!isContextReady || !batchReportData || !members) {
        console.log("PolarAreaChart - Missing context data");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const filteredData = batchReportData.filter(
        (report) => !selectedBatch || report.batchId === selectedBatch.id
      );

      const dataSource = filteredData.map((report) => {
        const member = members.find((m) => m.id === report.memberId);
        const totalTasks =
          (report.tasksCompleted || 0) +
          (report.tasksInProgress || 0) +
          (report.tasksTodo || 0);
        return {
          memberName: member?.name || `Member ${report.memberId}`,
          totalTasks,
        };
      });

      const totalTasks = dataSource.reduce((sum, d) => sum + d.totalTasks, 0);
      const uniqueMembers = new Set(dataSource.map((d) => d.memberName)).size;
      const avgTasksPerMember = uniqueMembers ? totalTasks / uniqueMembers : 0;
      const topContributor = dataSource.reduce(
        (max, d) => (d.totalTasks > (max.totalTasks || 0) ? d : max),
        { memberName: "None", totalTasks: 0 }
      );
      const lastUpdated = format(new Date(), "MMM dd, yyyy");

      console.log("PolarAreaChart - DataSource:", dataSource);

      if (!dataSource.length) {
        console.log("PolarAreaChart - No data available");
        return { chartData: null, csvData: [], metrics: {} };
      }

      const backgroundColors = [
        `${customColor || "#34d399"}80`,
        "#f59e0b80",
        "#ef444480",
        "#3b82f680",
        "#6366f180",
        "#8b5cf680",
        "#ec489980",
        "#f472b680",
        "#eab30880",
      ];

      const borderColors = backgroundColors.map((c) => c.replace("80", ""));

      const chartData = {
        labels: dataSource.map((d) => d.memberName),
        datasets: [
          {
            label: "Total Tasks",
            data: dataSource.map((d) => d.totalTasks),
            backgroundColor: backgroundColors.slice(0, dataSource.length),
            borderColor: borderColors.slice(0, dataSource.length),
            borderWidth: 1,
          },
        ],
      };

      const csvData = [
        ...dataSource.map((d) => ({
          Member: d.memberName,
          TotalTasks: d.totalTasks,
        })),
        {},
        {
          Member: "Metrics",
          TotalTasks: "",
        },
        {
          Member: "Total Tasks",
          TotalTasks: totalTasks,
        },
        {
          Member: "Average Tasks per Member",
          TotalTasks: avgTasksPerMember.toFixed(2),
        },
        {
          Member: "Top Contributor",
          TotalTasks: `${topContributor.memberName} (${topContributor.totalTasks})`,
        },
        {
          Member: "Last Updated",
          TotalTasks: lastUpdated,
        },
      ];

      console.log("PolarAreaChart - ChartData:", chartData);

      return {
        chartData,
        csvData,
        metrics: {
          totalTasks,
          avgTasksPerMember,
          topContributor: topContributor.memberName,
          topContributorTasks: topContributor.totalTasks,
          lastUpdated,
        },
      };
    } catch (err) {
      console.error("PolarAreaChart - Error:", err);
      setError(err.message);
      return { chartData: null, csvData: [], metrics: {} };
    }
  }, [batchReportData, members, selectedBatch, isContextReady, customColor]);

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
      r: {
        grid: {
          color: `${fontColor || "#e5e7eb"}33`,
        },
        pointLabels: {
          color: fontColor || "#1f2937",
        },
        ticks: {
          color: fontColor || "#1f2937",
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
        <ChartsHeader
          category="Polar Area"
          title="Task Distribution by Member"
        />
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

  if (!isReady || !isContextReady || !polarAreaChartData.chartData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        <ChartsHeader
          category="Polar Area"
          title="Task Distribution by Member"
        />
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
          category="Polar Area"
          title={
            selectedBatch
              ? `Task Distribution by Member - ${selectedBatch.name}`
              : "Team Task Distribution by Member"
          }
        />
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Visualize the distribution of total tasks across team members for the
          selected batch or entire team. This chart highlights each member's
          task load.
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
          data={polarAreaChartData.csvData}
          filename={`polar-area-report-${selectedBatch?.id || "team"}.csv`}
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
        <PolarArea
          id={chartId}
          data={polarAreaChartData.chartData}
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
            {polarAreaChartData.metrics.totalTasks}
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
            {polarAreaChartData.metrics.avgTasksPerMember.toFixed(2)}
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
            Top Contributor
          </p>
          <p className="text-lg" style={{ color: customColor }}>
            {polarAreaChartData.metrics.topContributor} (
            {polarAreaChartData.metrics.topContributorTasks})
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
            {polarAreaChartData.metrics.lastUpdated}
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
          Export data as CSV for task distribution analysis. Data reflects tasks
          for the {selectedBatch ? "selected batch" : "entire team"}.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(PolarAreaChart);
