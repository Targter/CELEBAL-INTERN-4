// import React, { useMemo, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useAppContext } from "../context/AppContext";
// import { useTheme } from "../context/TC";
// import { CSVLink } from "react-csv";
// import html2pdf from "html2pdf.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Charts = ({ selectedMemberId = null, chartId = "chart" }) => {
//   const { batchReportData, selectedBatch, members } = useAppContext();
//   const { backgroundColor, fontColor, customColor } = useTheme();
//   const chartRef = useRef(null);

//   //lighter/darker shades from customColor
//   const getShade = (hex, amount) => {
//     const num = parseInt(hex.replace("#", ""), 16);
//     let r = (num >> 16) + amount;
//     let g = ((num >> 8) & 0x00ff) + amount;
//     let b = (num & 0x0000ff) + amount;
//     r = Math.min(255, Math.max(0, r));
//     g = Math.min(255, Math.max(0, g));
//     b = Math.min(255, Math.max(0, b));
//     return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
//   };

//   const chartData = useMemo(() => {
//     let data = batchReportData;
//     if (selectedBatch) {
//       data = data.filter((report) => report.batchId === selectedBatch.id);
//     }
//     if (selectedMemberId) {
//       data = data.filter((report) => report.memberId === selectedMemberId);
//     }

//     const memberData = members.reduce((acc, member) => {
//       const memberReports = data.filter(
//         (report) => report.memberId === member.id
//       );
//       if (memberReports.length) {
//         acc.push({
//           memberId: member.id,
//           name: member.name,
//           tasksCompleted: memberReports.reduce(
//             (sum, r) => sum + (r.tasksCompleted || 0),
//             0
//           ),
//           tasksInProgress: memberReports.reduce(
//             (sum, r) => sum + (r.tasksInProgress || 0),
//             0
//           ),
//           tasksTodo: memberReports.reduce(
//             (sum, r) => sum + (r.tasksTodo || 0),
//             0
//           ),
//         });
//       }
//       return acc;
//     }, []);

//     return {
//       labels: memberData.map((m) => m.name),
//       datasets: [
//         {
//           label: "Tasks Completed",
//           data: memberData.map((m) => m.tasksCompleted),
//           backgroundColor: customColor || "#10b981",
//           borderColor: getShade(customColor || "#10b981", -20),
//           borderWidth: 1,
//         },
//         {
//           label: "Tasks In Progress",
//           data: memberData.map((m) => m.tasksInProgress),
//           backgroundColor: getShade(customColor || "#3b82f6", 20),
//           borderColor: getShade(customColor || "#3b82f6", -20),
//           borderWidth: 1,
//         },
//         {
//           label: "Tasks To Do",
//           data: memberData.map((m) => m.tasksTodo),
//           backgroundColor: getShade(customColor || "#ef4444", -20),
//           borderColor: getShade(customColor || "#ef4444", -40),
//           borderWidth: 1,
//         },
//       ],
//       csvData: memberData.map((m) => ({
//         Name: m.name,
//         "Tasks Completed": m.tasksCompleted,
//         "Tasks In Progress": m.tasksInProgress,
//         "Tasks To Do": m.tasksTodo,
//       })),
//     };
//   }, [batchReportData, selectedBatch, members, selectedMemberId, customColor]);

//   const exportPDF = () => {
//     const element = chartRef.current;
//     html2pdf()
//       .set({
//         margin: 10,
//         filename: `progress-report-${
//           selectedMemberId || selectedBatch?.name || "team"
//         }.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       })
//       .from(element)
//       .save();
//   };

//   return (
//     <div
//       className="w-full p-4 rounded-xl shadow-lg"
//       ref={chartRef}
//       style={{ backgroundColor, color: fontColor }}
//     >
//       <div className="flex justify-end space-x-4 mb-4">
//         <CSVLink
//           data={chartData.csvData}
//           filename={`progress-report-${
//             selectedMemberId || selectedBatch?.name || "team"
//           }.csv`}
//           className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors"
//           style={{ backgroundColor: customColor }}
//         >
//           Export CSV
//         </CSVLink>
//         <button
//           onClick={exportPDF}
//           className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors"
//           style={{ backgroundColor: customColor }}
//         >
//           Export PDF
//         </button>
//       </div>
//       <Bar
//         id={chartId}
//         data={chartData}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: {
//               position: "top",
//               labels: { color: fontColor },
//             },
//             title: {
//               display: true,
//               text: selectedMemberId
//                 ? `Progress Report - ${
//                     members.find((m) => m.id === selectedMemberId)?.name ||
//                     "Member"
//                   }`
//                 : selectedBatch
//                 ? `Progress Report - ${selectedBatch.name}`
//                 : "Team Progress Report",
//               color: fontColor,
//               font: { size: 18 },
//             },
//           },
//           scales: {
//             x: {
//               ticks: { color: fontColor },
//               grid: { color: `${fontColor}33` }, // 20% opacity
//             },
//             y: {
//               title: {
//                 display: true,
//                 text: "Number of Tasks",
//                 color: fontColor,
//                 font: { size: 14 },
//               },
//               ticks: { color: fontColor },
//               grid: { color: `${fontColor}33` }, // 20% opacity
//               beginAtZero: true,
//             },
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default React.memo(Charts);

//

import React, { useMemo, useRef, useState, useEffect } from "react";
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
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/TC";
import { CSVLink } from "react-csv";
import html2pdf from "html2pdf.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Charts = ({ selectedMemberId = null, chartId = "chart" }) => {
  const { batchReportData, selectedBatch, members } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const chartRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to generate lighter/darker shades
  const getShade = (hex, amount) => {
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const chartData = useMemo(() => {
    let data = batchReportData;
    if (selectedBatch) {
      data = data.filter((report) => report.batchId === selectedBatch.id);
    }
    if (selectedMemberId) {
      data = data.filter((report) => report.memberId === selectedMemberId);
    }

    const memberData = members.reduce((acc, member) => {
      const memberReports = data.filter(
        (report) => report.memberId === member.id
      );
      if (memberReports.length) {
        acc.push({
          memberId: member.id,
          name: member.name,
          tasksCompleted: memberReports.reduce(
            (sum, r) => sum + (r.tasksCompleted || 0),
            0
          ),
          tasksInProgress: memberReports.reduce(
            (sum, r) => sum + (r.tasksInProgress || 0),
            0
          ),
          tasksTodo: memberReports.reduce(
            (sum, r) => sum + (r.tasksTodo || 0),
            0
          ),
        });
      }
      return acc;
    }, []);

    return {
      labels: memberData.map((m) => m.name),
      datasets: [
        {
          label: "Tasks Completed",
          data: memberData.map((m) => m.tasksCompleted),
          backgroundColor: customColor || "#10b981",
          borderColor: getShade(customColor || "#10b981", -20),
          borderWidth: 1,
        },
        {
          label: "Tasks In Progress",
          data: memberData.map((m) => m.tasksInProgress),
          backgroundColor: getShade(customColor || "#3b82f6", 20),
          borderColor: getShade(customColor || "#3b82f6", -20),
          borderWidth: 1,
        },
        {
          label: "Tasks To Do",
          data: memberData.map((m) => m.tasksTodo),
          backgroundColor: getShade(customColor || "#ef4444", -20),
          borderColor: getShade(customColor || "#ef4444", -40),
          borderWidth: 1,
        },
      ],
      csvData: memberData.map((m) => ({
        Name: m.name,
        "Tasks Completed": m.tasksCompleted,
        "Tasks In Progress": m.tasksInProgress,
        "Tasks To Do": m.tasksTodo,
      })),
    };
  }, [batchReportData, selectedBatch, members, selectedMemberId, customColor]);

  const exportPDF = () => {
    const element = chartRef.current;
    html2pdf()
      .set({
        margin: 10,
        filename: `progress-report-${
          selectedMemberId || selectedBatch?.name || "team"
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  // Responsive chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: windowWidth < 768 ? false : true,
      plugins: {
        legend: {
          position: windowWidth < 768 ? "bottom" : "top",
          labels: {
            color: fontColor,
            boxWidth: 12,
            padding: windowWidth < 768 ? 20 : 10,
            font: {
              size: windowWidth < 768 ? 12 : 14,
            },
          },
        },
        title: {
          display: true,
          text: selectedMemberId
            ? `Progress Report - ${
                members.find((m) => m.id === selectedMemberId)?.name || "Member"
              }`
            : selectedBatch
            ? `Progress Report - ${selectedBatch.name}`
            : "Team Progress Report",
          color: fontColor,
          font: {
            size: windowWidth < 768 ? 14 : 18,
          },
          padding: {
            top: 10,
            bottom: windowWidth < 768 ? 20 : 30,
          },
        },
        tooltip: {
          titleFont: {
            size: windowWidth < 768 ? 12 : 14,
          },
          bodyFont: {
            size: windowWidth < 768 ? 12 : 14,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: fontColor,
            font: {
              size: windowWidth < 768 ? 10 : 12,
            },
          },
          grid: {
            color: `${fontColor}33`,
            display: windowWidth < 768 ? false : true,
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Tasks",
            color: fontColor,
            font: {
              size: windowWidth < 768 ? 12 : 14,
            },
          },
          ticks: {
            color: fontColor,
            font: {
              size: windowWidth < 768 ? 10 : 12,
            },
          },
          grid: {
            color: `${fontColor}33`,
          },
          beginAtZero: true,
        },
      },
    }),
    [windowWidth, fontColor, selectedMemberId, selectedBatch, members]
  );

  return (
    <div
      className="w-full p-2 sm:p-4 rounded-xl shadow-lg"
      ref={chartRef}
      style={{ backgroundColor, color: fontColor }}
    >
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
        <CSVLink
          data={chartData.csvData}
          filename={`progress-report-${
            selectedMemberId || selectedBatch?.name || "team"
          }.csv`}
          className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-xs sm:text-sm whitespace-nowrap"
          style={{ backgroundColor: customColor }}
        >
          Export CSV
        </CSVLink>
        <button
          onClick={exportPDF}
          className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-xs sm:text-sm whitespace-nowrap"
          style={{ backgroundColor: customColor }}
        >
          Export PDF
        </button>
      </div>
      <div
        className="relative"
        style={{ height: windowWidth < 768 ? "400px" : "500px" }}
      >
        <Bar id={chartId} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default React.memo(Charts);
