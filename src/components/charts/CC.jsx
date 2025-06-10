import React, { Component } from "react";
import { useAppContext } from "../../context/AppContext";
import BarChart from "./BarChart";
import StackChart from "./StackChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import RadarChart from "./RadarChart";
import PolarAreaChart from "./PolarAreaChart";
import AreaChart from "./AreaChart";
// Error Boundary Component
class ChartErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Chart Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {this.state.error?.message ||
              "An error occurred while rendering the chart."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const Charts = () => {
  const { isContextReady, selectedBatch } = useAppContext();

  const chartIds = {
    bar: selectedBatch
      ? `batch-${selectedBatch.id}-bar-chart`
      : `task-status-bar-chart`,
    stack: selectedBatch
      ? `batch-${selectedBatch.id}-stack-chart`
      : `batch-task-stack-chart`,
    pie: selectedBatch
      ? `batch-${selectedBatch.id}-pie-chart`
      : `task-status-pie-chart`,
    line: selectedBatch
      ? `batch-${selectedBatch.id}-line-chart`
      : `task-progress-line-chart`,
    doughnut: selectedBatch
      ? `batch-${selectedBatch.id}-doughnut-chart`
      : `task-priority-doughnut-chart`,
    radar: selectedBatch
      ? `batch-${selectedBatch.id}-radar-chart`
      : `batch-task-radar-chart`,
    polarArea: selectedBatch
      ? `batch-${selectedBatch.id}-polar-area-chart`
      : `polar-area-chart`,
    area: selectedBatch
      ? `batch-${selectedBatch.id}-area-chart`
      : `task-progress-area-chart`, // 🔥 NEW ID
  };

  if (!isContextReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Loading charts...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartErrorBoundary>
          <BarChart chartId={chartIds.bar} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <StackChart chartId={chartIds.stack} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <PieChart chartId={chartIds.pie} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <LineChart chartId={chartIds.line} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <DoughnutChart chartId={chartIds.doughnut} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <RadarChart chartId={chartIds.radar} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <PolarAreaChart chartId={chartIds.polarArea} />
        </ChartErrorBoundary>

        <ChartErrorBoundary>
          <AreaChart chartId={chartIds.area} />
        </ChartErrorBoundary>
      </div>
    </div>
  );
};

export default Charts;
