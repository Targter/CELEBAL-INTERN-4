import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
// import { toast } from "react-toastify";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAppContext } from "../context/AppContext";
import BatchModal from "../components/BatchModal";
import Charts from "../components/Charts";
import {
  FaEdit,
  FaTrash,
  FaChartBar,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useTheme } from "../context/TC";

const ColumnFilter = ({ column }) => {
  const { backgroundColor, fontColor, customColor } = useTheme();
  return (
    <input
      value={column.getFilterValue() || ""}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder="Filter..."
      className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
      style={{ backgroundColor, color: fontColor }}
    />
  );
};

const Batches = () => {
  const {
    batches,
    projects,
    members,
    batchReportData,
    deleteBatch,
    selectBatch,
    selectedBatch,
    currentUser,
  } = useAppContext();
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editBatch, setEditBatch] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showMemberProfiles, setShowMemberProfiles] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileFilter, setProfileFilter] = useState("");
  const [showReport, setShowReport] = useState(false);
  // const { projects, members, addBatch, updateBatch } = useAppContext();
  const { backgroundColor, fontColor, customColor, mode } = useTheme();
  console.log("modee", mode);
  const columns = useMemo(
    () => [
      {
        header: "Batch Name",
        accessorKey: "name",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Project",
        accessorKey: "projectId",
        cell: ({ getValue }) => {
          const project = projects.find((p) => p.id === getValue());
          return project ? project.name : "N/A";
        },
        filterFn: (row, columnId, value) => {
          if (!value) return true;
          return row.getValue(columnId) === parseInt(value);
        },
        meta: {
          filterComponent: ({ column }) => (
            <select
              value={column.getFilterValue() || ""}
              onChange={(e) =>
                column.setFilterValue(e.target.value || undefined)
              }
              className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full  "
              style={{
                backgroundColor: `${backgroundColor}10`,
                color: `${fontColor}`,
              }}
            >
              <option value="" style={{ backgroundColor }}>
                All
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} style={{ backgroundColor }}>
                  {p.name}
                </option>
              ))}
            </select>
          ),
        },
      },
      {
        header: "Members",
        accessorKey: "members",
        cell: ({ getValue }) => getValue().length,
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            {currentUser.role === "Admin" && (
              <>
                <button
                  onClick={() => {
                    setEditBatch(row.original);
                    setShowBatchModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit Batch"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setDeleteConfirm(row.original)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Batch"
                >
                  <FaTrash />
                </button>
              </>
            )}
            <button
              onClick={() => {
                selectBatch(row.original);
                setShowMemberProfiles(true);
                setProfileFilter("");
              }}
              className="text-green-500 hover:text-green-700"
              title="View Members"
            >
              <FaUsers />
            </button>
            <button
              onClick={() => {
                selectBatch(row.original);
                setShowReport(true);
              }}
              className="text-purple-500 hover:text-purple-700"
              title="View Report"
            >
              <FaChartBar />
            </button>
          </div>
        ),
      },
    ],
    [projects, selectBatch, currentUser, backgroundColor, fontColor, mode]
  );

  const table = useReactTable({
    data: batches,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteBatch(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const filteredBatchMembers = useMemo(() => {
    if (!selectedBatch) return [];
    const batchMembers = members.filter((m) =>
      selectedBatch.members.includes(m.id)
    );
    if (profileFilter) {
      return batchMembers.filter(
        (m) =>
          m.id.toString().includes(profileFilter) ||
          m.name.toLowerCase().includes(profileFilter.toLowerCase())
      );
    }
    return batchMembers;
  }, [members, selectedBatch, profileFilter]);

  const getMemberProgress = (memberId) => {
    const memberReports = batchReportData.filter(
      (report) =>
        report.memberId === memberId && selectedBatch?.id === report.batchId
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
    return {
      completionRate: totalTasks
        ? ((tasksCompleted / totalTasks) * 100).toFixed(2)
        : 0,
      tasksCompleted,
      tasksInProgress: memberReports.reduce(
        (sum, report) => sum + report.tasksInProgress,
        0
      ),
      tasksTodo: memberReports.reduce(
        (sum, report) => sum + report.tasksTodo,
        0
      ),
    };
  };
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      style={{ backgroundColor, color: fontColor }}
    >
      <div
        className="flex items-center justify-between flex-wrap gap-4"
        style={{ backgroundColor, color: fontColor }}
      >
        <h1
          className="text-3xl font-bold text-gray-800 dark:text-white"
          style={{ backgroundColor, color: fontColor }}
        >
          Batches
        </h1>
        {currentUser.role === "Admin" && (
          <button
            onClick={() => {
              setEditBatch(null);
              setShowBatchModal(true);
            }}
            className="bg-theme  px-4 py-2 rounded-lg hover:bg-opacity-90"
            style={{ backgroundColor: `${customColor}10` }}
          >
            Add Batch
          </button>
        )}
      </div>

      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        style={{ backgroundColor: `${customColor}10` }}
      >
        <h2 className="text-xl font-semibold mb-4">Batch List</h2>
        <div className="overflow-x-auto">
          <table
            className="w-full text-left"
            role="grid"
            aria-label="Batches List"
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 border-b border-gray-200 dark:border-gray-700"
                      onClick={header.column.getToggleSortingHandler()}
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => selectBatch(row.original)}
                    style={{ backgroundColor: `${customColor}10` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-4 border-b border-gray-200 dark:border-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-600 dark:text-gray-400"
                  >
                    No batches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2  rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="" style={{ color: fontColor }}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2  rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {showMemberProfiles && selectedBatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" p-6 rounded-xl shadow-lg"
          style={{ backgroundColor: `${customColor}10` }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-semibold">
              Members - {selectedBatch.name}
            </h2>
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                value={profileFilter}
                onChange={(e) => setProfileFilter(e.target.value)}
                placeholder="Filter by ID or Name"
                className="p-2 border border-gray-300 dark:border-gray-600 rounded"
              />
              <button
                onClick={() => setShowMemberProfiles(false)}
                className="px-4 py-2  rounded "
                style={{ backgroundColor: `${customColor}10` }}
              >
                Close
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatchMembers.length ? (
              filteredBatchMembers.map((member) => (
                <div
                  key={member.id}
                  className={` p-4 rounded-lg shadow-md cursor-pointer `}
                  onMouseEnter={() => setHovered(member.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    backgroundColor:
                      hovered === member.id ? backgroundColor : "transparent",
                    color: hovered === member.id ? fontColor : undefined,
                  }}
                  onClick={() =>
                    setSelectedMember({
                      ...member,
                      ...getMemberProgress(member.id),
                    })
                  }
                >
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="">ID: {member.id}</p>
                  <p className="">Email: {member.email}</p>
                  <p className="">Role: {member.role}</p>
                  <p className="">
                    Completion Rate:{" "}
                    {getMemberProgress(member.id).completionRate}%
                  </p>
                </div>
              ))
            ) : (
              <p className=" col-span-full text-center">No members found.</p>
            )}
          </div>
        </motion.div>
      )}

      {selectedMember && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0  flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white  p-6 rounded-xl shadow-lg w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold  mb-4">
              {selectedMember.name}'s Profile
            </h2>
            <p className="">ID: {selectedMember.id}</p>
            <p className="">Email: {selectedMember.email}</p>
            <p>Role: {selectedMember.role}</p>
            <p>Completion Rate: {selectedMember.completionRate}%</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold  mb-2">
                Progress in {selectedBatch.name}
              </h3>
              <Charts
                selectedMemberId={selectedMember.id}
                chartId={`member-chart-${selectedMember.id}`}
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2  rounded "
                style={{ backgroundColor: `${customColor}10` }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showReport && selectedBatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white  p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-semibold ">
              Progress Report - {selectedBatch.name}
            </h2>
            <button
              onClick={() => setShowReport(false)}
              className="px-4 py-2  rounded "
              style={{ backgroundColor: `${customColor}10` }}
            >
              Close
            </button>
          </div>
          <Charts chartId={`batch-chart-${selectedBatch.id}`} />
        </motion.div>
      )}

      {showBatchModal && (
        <BatchModal
          batch={editBatch}
          onClose={() => {
            setShowBatchModal(false);
            setEditBatch(null);
          }}
        />
      )}

      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white  p-6 rounded-xl shadow-lg w-full max-w-sm"
          >
            <h2 className="text-xl font-semibold  mb-4">Confirm Delete</h2>
            <p className=" mb-6">
              Are you sure you want to delete batch "{deleteConfirm.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2  rounded-lg "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Batches;
