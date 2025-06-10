import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/Themecontext";
import Charts from "../components/Charts";
import { FaUser, FaTimes } from "react-icons/fa";

const ColumnFilter = ({ column }) => {
  const { backgroundColor, fontColor } = useTheme();
  return (
    <input
      value={column.getFilterValue() || ""}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder="Filter..."
      className="mt-2 p-2 border rounded w-full text-sm"
      style={{
        backgroundColor: `${backgroundColor}cc`,
        color: fontColor,
        borderColor: `${fontColor}33`,
      }}
    />
  );
};

const Profiles = () => {
  const { members, batchReportData, batches, isContextReady } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [profileFilter, setProfileFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showTeamReport, setShowTeamReport] = useState(false);

  const memberColumns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Name",
        accessorKey: "name",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Email",
        accessorKey: "email",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Role",
        accessorKey: "role",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Completion Rate",
        accessorKey: "completionRate",
        cell: ({ getValue }) => `${getValue().toFixed(2)}%`,
        filterFn: (row, columnId, value) => {
          if (!value) return true;
          return row.getValue(columnId) >= parseFloat(value);
        },
        meta: {
          filterComponent: ({ column }) => (
            <input
              type="number"
              value={column.getFilterValue() || ""}
              onChange={(e) =>
                column.setFilterValue(e.target.value || undefined)
              }
              placeholder="Min %"
              className="mt-2 p-2 border rounded w-full text-sm"
              style={{
                backgroundColor: `${backgroundColor}cc`,
                color: fontColor,
                borderColor: `${fontColor}33`,
              }}
            />
          ),
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedMember(row.original)}
            className="hover:opacity-80 transition-opacity"
            title="View Profile"
            style={{ color: customColor }}
          >
            <FaUser className="w-5 h-5" />
          </button>
        ),
      },
    ],
    [backgroundColor, fontColor, customColor]
  );

  const enrichedMembers = useMemo(() => {
    return members.map((member) => {
      const memberReports = batchReportData.filter(
        (report) => report.memberId === member.id
      );
      const totalTasks = memberReports.reduce(
        (sum, report) =>
          sum +
          (report.tasksCompleted + report.tasksInProgress + report.tasksTodo),
        0
      );
      const tasksCompleted = memberReports.reduce(
        (sum, report) => sum + report.tasksCompleted,
        0
      );
      const completionRate = totalTasks
        ? (tasksCompleted / totalTasks) * 100
        : 0;
      return { ...member, completionRate };
    });
  }, [members, batchReportData]);

  const table = useReactTable({
    data: enrichedMembers,
    columns: memberColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredMembers = useMemo(() => {
    if (profileFilter) {
      return enrichedMembers.filter(
        (m) =>
          m.id.toString().includes(profileFilter) ||
          m.name.toLowerCase().includes(profileFilter.toLowerCase())
      );
    }
    return enrichedMembers;
  }, [enrichedMembers, profileFilter]);

  if (!isContextReady || !members.length) {
    return (
      <div className="p-6 text-center" style={{ color: fontColor }}>
        Loading team profiles...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-8 min-h-screen"
      style={{ backgroundColor }}
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: fontColor }}
        >
          Team Profiles
        </h1>
        <p className="mt-2 text-lg" style={{ color: `${fontColor}cc` }}>
          Explore your team's profiles, track individual performance, and
          analyze project contributions. Click a profile to view detailed
          progress charts.
        </p>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value)}
            placeholder="Search by ID or Name"
            className="p-2 pr-8 border rounded w-full text-sm"
            style={{
              backgroundColor: `${backgroundColor}cc`,
              color: fontColor,
              borderColor: `${fontColor}33`,
            }}
          />
          {profileFilter && (
            <button
              onClick={() => setProfileFilter("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              style={{ color: fontColor }}
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowTeamReport(!showTeamReport)}
          className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: customColor }}
        >
          {showTeamReport ? "Hide Team Report" : "Show Team Report"}
        </button>
      </motion.div>

      {/* Members Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: `${backgroundColor}ee` }}
      >
        <div className="p-4 sm:p-6">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: fontColor }}
          >
            Team Members ({filteredMembers.length})
          </h2>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left"
              role="grid"
              aria-label="Team Members List"
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    style={{ borderBottom: `1px solid ${fontColor}33` }}
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-4 cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ color: fontColor }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span>
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted()] ?? ""}
                        </span>
                        {header.column.getCanFilter() &&
                        header.column.columnDef.meta?.filterComponent
                          ? header.column.columnDef.meta.filterComponent({
                              column: header.column,
                            })
                          : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                <AnimatePresence>
                  {table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-opacity-10 transition-colors"
                      style={{
                        borderBottom: `1px solid ${fontColor}22`,
                        backgroundColor: `rgba(${parseInt(
                          customColor.slice(1, 3),
                          16
                        )}, ${parseInt(
                          customColor.slice(3, 5),
                          16
                        )}, ${parseInt(customColor.slice(5, 7), 16)}, 0.05)`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-4"
                          style={{ color: fontColor }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Team Report */}
      <AnimatePresence>
        {showTeamReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-xl shadow-lg"
            style={{ backgroundColor: `${backgroundColor}ee` }}
          >
            <div className="p-4 sm:p-6">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: fontColor }}
              >
                Team Progress Report
              </h2>
              <Charts />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            style={{ backgroundColor: `${backgroundColor}80` }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg"
              style={{ backgroundColor, color: fontColor }}
            >
              <h2 className="text-xl font-semibold mb-4">
                {selectedMember.name}'s Profile
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">ID:</span> {selectedMember.id}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedMember.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span>{" "}
                  {selectedMember.role}
                </p>
                <p>
                  <span className="font-medium">Completion Rate:</span>{" "}
                  {selectedMember.completionRate.toFixed(2)}%
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Assigned Batches</h3>
                {batches.filter((b) => b.members.includes(selectedMember.id))
                  .length ? (
                  batches
                    .filter((b) => b.members.includes(selectedMember.id))
                    .map((batch) => (
                      <p key={batch.id} className="text-sm">
                        {batch.name}
                      </p>
                    ))
                ) : (
                  <p className="text-sm opacity-70">No batches assigned.</p>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Task Progress</h3>
                <div
                  className="bg-opacity-10 p-4 rounded-lg"
                  style={{ backgroundColor: `${customColor}20` }}
                >
                  <Charts selectedMemberId={selectedMember.id} />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: `${fontColor}33`,
                    color: fontColor,
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-sm" style={{ color: `${fontColor}aa` }}>
          Manage your team effectively with real-time insights. Add or update
          members in the Dashboard to keep your profiles up to date.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Profiles;
