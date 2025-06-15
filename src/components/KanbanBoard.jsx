import React, { useState, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/TC";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaGripVertical, FaPlus, FaLinkedin } from "react-icons/fa";

// CSS to prevent text selection and enhance drag
const styles = `
  .task-card {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    touch-action: manipulation;
  }
  .task-card.dragging {
    opacity: 0.8;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .drag-handle {
    cursor: grab;
    padding: 4px;
  }
  .column {
    min-height: 100px;
  }
`;

const KanbanBoard = () => {
  const {
    tasks,
    updateTaskStatus,
    selectTask,
    selectedTask,
    selectedBatch,
    selectBatch,
    addTask,
    batches,
    projects,
    members,
    isContextReady,
  } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState("To Do");
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    priority: "Medium",
    projectId: selectedBatch?.projectId || "",
    assignedTo: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  useEffect(() => {
    console.log("KanbanBoard Context:", {
      tasks: tasks.length,
      selectedBatch,
      isContextReady,
      batches: batches.length,
    });
  }, [tasks, selectedBatch, isContextReady, batches]);

  useEffect(() => {
    if (isContextReady && batches.length && !selectedBatch) {
      console.log("Setting default selectedBatch:", batches[0]);
      selectBatch(batches[0]);
    }
  }, [isContextReady, batches, selectedBatch, selectBatch]);

  const filteredTasks = useMemo(() => {
    if (!isContextReady || !selectedBatch) {
      console.log("filteredTasks: Returning empty array due to invalid state", {
        isContextReady,
        selectedBatch,
      });
      return [];
    }
    const filtered = tasks.filter((t) => t.batchId === selectedBatch.id);
    console.log("filteredTasks:", filtered, "Batch ID:", selectedBatch.id);
    return filtered;
  }, [tasks, selectedBatch, isContextReady]);

  const columns = useMemo(() => {
    const defaultColumns = {
      "To Do": { name: "To Do", tasks: [] },
      "In Progress": { name: "In Progress", tasks: [] },
      Done: { name: "Done", tasks: [] },
    };
    if (!filteredTasks) {
      console.log(
        "columns: Returning default columns due to null filteredTasks"
      );
      return defaultColumns;
    }
    return {
      "To Do": {
        name: "To Do",
        tasks: filteredTasks.filter((t) => t.status === "To Do") || [],
      },
      "In Progress": {
        name: "In Progress",
        tasks: filteredTasks.filter((t) => t.status === "In Progress") || [],
      },
      Done: {
        name: "Done",
        tasks: filteredTasks.filter((t) => t.status === "Done") || [],
      },
    };
  }, [filteredTasks]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    console.log("onDragEnd:", { source, destination, draggableId });
    if (!destination) {
      console.log("Drag cancelled: no destination");
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log("No change in position");
      return;
    }

    const movedTask = columns[source.droppableId]?.tasks[source.index];
    if (!movedTask) {
      console.error("Moved task not found:", { source, draggableId });
      toast.error("Failed to move task", { autoClose: 3000 });
      return;
    }
    try {
      updateTaskStatus(movedTask.id, destination.droppableId);
      console.log("Status updated:", {
        taskId: movedTask.id,
        newStatus: destination.droppableId,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to move task", { autoClose: 3000 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssignedToToggle = (memberId) => {
    setFormData({
      ...formData,
      assignedTo: formData.assignedTo.includes(memberId)
        ? formData.assignedTo.filter((id) => id !== memberId)
        : [...formData.assignedTo, memberId],
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.projectId) newErrors.projectId = "Project is required";
    if (!formData.assignedTo.length)
      newErrors.assignedTo = "At least one assignee is required";
    if (
      formData.dueDate &&
      new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)
    ) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatch) {
      toast.error("No batch selected", { autoClose: 3000 });
      return;
    }
    if (validateForm()) {
      const taskData = {
        ...formData,
        status: targetStatus,
        batchId: selectedBatch.id,
        projectId: Number(formData.projectId),
      };
      console.log("Adding task:", taskData);
      try {
        addTask(taskData);
        setShowTaskModal(false);
        setFormData({
          name: "",
          dueDate: "",
          priority: "Medium",
          projectId: selectedBatch?.projectId || "",
          assignedTo: [],
        });
        setTargetStatus("To Do");
        setErrors({});
        toast.success("Task added successfully", { autoClose: 3000 });
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Failed to add task", { autoClose: 3000 });
      }
    }
  };

  const closeModal = () => {
    setShowTaskModal(false);
    setFormData({
      name: "",
      dueDate: "",
      priority: "Medium",
      projectId: selectedBatch?.projectId || "",
      assignedTo: [],
    });
    setTargetStatus("To Do");
    setErrors({});
  };

  if (!isContextReady || !batches.length || !selectedBatch) {
    console.log("Rendering Loading state:", {
      isContextReady,
      batchesLength: batches.length,
      selectedBatch,
    });
    return <div style={{ color: fontColor, padding: "16px" }}>Loading...</div>;
  }

  return (
    // <div className="p-4">
    //   <div className="mb-4 flex items-center space-x-4">
    //     <h2 className="text-xl font-bold" style={{ color: fontColor }}>
    //       Kanban Board: {selectedBatch.name}
    //     </h2>
    //     <select
    //       value={selectedBatch.id}
    //       onChange={(e) => {
    //         const batch = batches.find((b) => b.id === Number(e.target.value));
    //         console.log("Switching batch:", batch);
    //         if (batch) selectBatch(batch);
    //       }}
    //       className="p-2 rounded-lg"
    //       style={{
    //         backgroundColor: `${backgroundColor}cc`,
    //         color: fontColor,
    //         borderColor: `${fontColor}33`,
    //       }}
    //     >
    //       {batches.map((batch) => (
    //         <option key={batch.id} value={batch.id}>
    //           {batch.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    // </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 rounded-xl shadow-lg"
      style={{ backgroundColor, color: fontColor }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
      >
        <motion.h2
          className="text-2xl sm:text-3xl font-extrabold"
          style={{
            backgroundColor,
            color: fontColor,
          }}
          whileHover={{ scale: 1.05 }}
        >
          Kanban Board: {selectedBatch.name}
        </motion.h2>
        <select
          value={selectedBatch.id}
          onChange={(e) => {
            const batch = batches.find((b) => b.id === Number(e.target.value));
            console.log("Switching batch:", batch);
            if (batch) selectBatch(batch);
          }}
          className="p-2 rounded-lg text-sm w-full sm:w-auto"
          style={{
            backgroundColor: `${backgroundColor}cc`,
            color: fontColor,
            borderColor: `${fontColor}33`,
          }}
        >
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
      </motion.div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {Object.entries(columns).map(([colId, column]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided, snapshot) => (
                console.log("Rendering column:", {
                  colId,
                  tasks: column.tasks,
                }),
                (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="column p-4 rounded-lg w-full sm:w-1/3 shadow-lg"
                    style={{
                      backgroundColor: snapshot.isDraggingOver
                        ? `${customColor}33`
                        : backgroundColor,
                      border: `2px solid ${customColor}`,
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: fontColor }}
                      >
                        {column.name}
                      </h3>
                      <button
                        onClick={() => {
                          setTargetStatus(colId);
                          setShowTaskModal(true);
                        }}
                        className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
                        style={{
                          backgroundColor: customColor,
                          color: "#ffffff",
                        }}
                        aria-label={`Add task to ${column.name}`}
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                    </div>
                    {(column.tasks || []).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`task-card p-3 rounded-lg shadow mb-2 flex items-start ${
                              snapshot.isDragging ? "dragging" : ""
                            } `}
                            style={{
                              backgroundColor:
                                task.id === selectedTask?.id
                                  ? `${customColor}70`
                                  : backgroundColor,
                              color: fontColor,
                              border: `1px solid ${fontColor}33`,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="drag-handle mr-2 mt-1"
                            >
                              <FaGripVertical
                                className="w-4 h-4"
                                style={{ color: fontColor }}
                              />
                            </div>
                            <div onClick={() => selectTask(task)}>
                              <p className="font-medium">{task.name}</p>
                              <p
                                className="text-sm"
                                style={{ color: `${fontColor}cc` }}
                              >
                                Due: {task.dueDate || "N/A"} | Priority:{" "}
                                {task.priority}
                              </p>
                              <p
                                className="text-sm"
                                style={{ color: `${fontColor}cc` }}
                              >
                                Assigned:{" "}
                                {task?.assignedTo
                                  .map(
                                    (id) =>
                                      members.find((m) => m.id === id)?.name ||
                                      "Unknown"
                                  )
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {showTaskModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="p-6 rounded-xl shadow-lg w-full max-w-md"
            style={{
              backgroundColor: `${backgroundColor}`,
              color: fontColor,
            }}
          >
            <h3 className="text-lg font-semibold mb-4">
              Add Task to {targetStatus}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Project</label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.projectId}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Assigned To</label>
                <div
                  className="max-h-40 overflow-y-auto border rounded-lg p-2"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(m.id)}
                        onChange={() => handleAssignedToToggle(m.id)}
                        className="mr-2"
                      />
                      <span>
                        {m.name} ({m.email})
                      </span>
                    </div>
                  ))}
                </div>
                {errors.assignedTo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.assignedTo}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
                  style={{
                    backgroundColor: `${fontColor}33`,
                    color: fontColor,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors"
                  style={{ backgroundColor: customColor }}
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 text-center text-sm"
        style={{ color: `${fontColor}aa` }}
      >
        <p>
          Drag tasks to update status or add new tasks to manage your workflow.
        </p>
        <motion.a
          href="https://www.linkedin.com/in/bansalabhay/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center mt-2 text-lg"
          style={{ color: fontColor }}
          aria-label="Visit my LinkedIn profile"
        >
          <FaLinkedin className="w-4 h-4 mr-1" />
          Connect on LinkedIn
        </motion.a>
      </motion.div>

      <style>
        {`
          .task-card {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            touch-action: manipulation;
          }
          .task-card.dragging {
            opacity: 0.8;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .drag-handle {
            cursor: grab;
            padding: 4px;
          }
          .column {
            min-height: 100px;
          }
        `}
      </style>
    </motion.div>
  );
};

export default React.memo(KanbanBoard);
