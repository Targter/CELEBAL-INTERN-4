import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/TC";

const ColumnFilter = ({ column }) => {
  const { backgroundColor, fontColor, customColor } = useTheme();
  return (
    <input
      value={column.getFilterValue() || ""}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      placeholder="Filter..."
      className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full "
      style={{
        backgroundColor: `${backgroundColor}10`,
        color: `${fontColor}`,
      }}
    />
  );
};

const Tables = ({ onSelectTask, onSelectProject, onSelectBatch }) => {
  const { tasks, date, selectedBatch, projects, batches, selectedTask } =
    useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [view, setView] = useState("batches"); // 'tasks', 'projects', 'batches'

  const taskColumns = useMemo(
    () => [
      {
        header: "Task Name",
        accessorKey: "name",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Status",
        accessorKey: "status",
        filterFn: "equalsString",
        meta: {
          filterComponent: ({ column }) => (
            <select
              value={column.getFilterValue() || ""}
              onChange={(e) =>
                column.setFilterValue(e.target.value || undefined)
              }
              className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full "
              style={{
                backgroundColor: `${backgroundColor}10`,
                color: `${fontColor}`,
              }}
            >
              <option value="" style={{ backgroundColor }}>
                All
              </option>
              <option value="To Do" style={{ backgroundColor }}>
                To Do
              </option>
              <option value="In Progress" style={{ backgroundColor }}>
                In Progress
              </option>
              <option value="Done" style={{ backgroundColor }}>
                Done
              </option>
            </select>
          ),
        },
      },
      {
        header: "Due Date",
        accessorKey: "dueDate",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Priority",
        accessorKey: "priority",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Batch",
        accessorKey: "batchId",
        cell: ({ getValue }) => {
          const batch = batches.find((b) => b.id === getValue());
          return batch ? batch.name : "N/A";
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
              className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full "
              style={{
                backgroundColor: `${backgroundColor}10`,
                color: `${fontColor}`,
              }}
            >
              <option
                value=""
                style={{ backgroundColor: `${backgroundColor}10` }}
              >
                All
              </option>
              {batches.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                  style={{ backgroundColor: `${backgroundColor}10` }}
                >
                  {b.name}
                </option>
              ))}
            </select>
          ),
        },
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
              className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full "
              style={{
                backgroundColor: `${backgroundColor}10`,
                color: `${fontColor}`,
              }}
            >
              <option
                value=""
                style={{ backgroundColor: `${backgroundColor}10` }}
              >
                All
              </option>
              {projects.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  style={{ backgroundColor: `${backgroundColor}10` }}
                >
                  {p.name}
                </option>
              ))}
            </select>
          ),
        },
      },
    ],
    [batches, projects, backgroundColor, fontColor]
  );

  const projectColumns = useMemo(
    () => [
      {
        header: "Project Name",
        accessorKey: "name",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Description",
        accessorKey: "description",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
      {
        header: "End Date",
        accessorKey: "endDate",
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
    ],
    []
  );

  const batchColumns = useMemo(
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
              className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded w-full "
              style={{
                backgroundColor: `${backgroundColor}10`,
                color: `${fontColor}`,
              }}
            >
              <option
                value=""
                style={{ backgroundColor: `${backgroundColor}10` }}
              >
                All
              </option>
              {projects.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  style={{ backgroundColor: `${backgroundColor}10` }}
                >
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
        cell: ({ getValue }) => getValue().join(", "),
        filterFn: "includesString",
        meta: { filterComponent: ColumnFilter },
      },
    ],
    [projects]
  );

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedBatch) {
      filtered = filtered.filter((task) => task.batchId === selectedBatch.id);
    }
    if (date?.length) {
      filtered = filtered.filter((task) =>
        date.some(
          (d) => new Date(task.dueDate).toDateString() === d.toDateString()
        )
      );
    }
    return filtered;
  }, [tasks, selectedBatch, date]);

  const data =
    view === "projects"
      ? projects
      : view === "batches"
      ? batches
      : filteredTasks;
  const columns =
    view === "projects"
      ? projectColumns
      : view === "batches"
      ? batchColumns
      : taskColumns;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div style={{ backgroundColor, color: fontColor }}>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setView("batches")}
          className={`px-4 py-2 rounded-lg ${
            view === "batches" ? "bg-theme text-white" : ""
          }`}
          style={{
            backgroundColor: view === "batches" ? customColor : "#e5e7eb",
            color: view === "batches" ? "#ffffff" : "#000000",
          }}
        >
          Batches
        </button>
        <button
          onClick={() => setView("projects")}
          className={`px-4 py-2 rounded-lg ${
            view === "projects" ? "bg-theme text-white" : ""
          }`}
          style={{
            backgroundColor: view === "projects" ? customColor : "#e5e7eb",
            color: view === "projects" ? "#ffffff" : "#000000",
          }}
        >
          Projects
        </button>
        <button
          onClick={() => setView("tasks")}
          className={`px-4 py-2 rounded-lg ${
            view === "tasks" ? "bg-theme text-white" : ""
          }`}
          style={{
            backgroundColor: view === "tasks" ? customColor : "#e5e7eb",
            color: view === "tasks" ? "#ffffff" : "#000000",
          }}
        >
          Tasks
        </button>
      </div>
      <table
        className="w-full text-left text-gray-800 dark:text-gray-200"
        role="grid"
        aria-label={`${view} List`}
        style={{ backgroundColor, color: fontColor }}
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() =>
                view === "tasks"
                  ? onSelectTask(row.original)
                  : view === "projects"
                  ? onSelectProject(row.original)
                  : onSelectBatch(row.original)
              }
              className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                view === "tasks" && row.original.id === selectedTask?.id
                  ? "bg-theme text-white"
                  : ""
              }`}
              style={{
                backgroundColor:
                  view === "tasks" && row.original.id === selectedTask?.id
                    ? customColor
                    : backgroundColor,
                color:
                  view === "tasks" && row.original.id === selectedTask?.id
                    ? "#ffffff"
                    : fontColor,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Tables);
