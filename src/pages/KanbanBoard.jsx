import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { FaLinkedin, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 16px;
`;

const Header = styled(motion.header)`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const ColumnsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(329px, 1fr));
  gap: 16px;
  margin: 8px;
`;

const TaskList = styled(motion.div)`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid ${(props) => props.customColor};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
  padding: 16px;
`;

const ModalContent = styled(motion.div)`
  //   background: ${(props) => props.backgroundColor};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Board = () => {
  const {
    tasks,
    batches,
    projects,
    members,
    selectedBatch,
    selectBatch,
    addTask,
    updateTask,
    updateTaskStatus,
    isContextReady,
  } = useAppContext();
  const { backgroundColor, fontColor, customColor, mode } = useTheme();
  const [columns, setColumns] = useState({
    "To Do": { title: "To Do", items: [], color: "#FF5733" },
    "In Progress": { title: "In Progress", items: [], color: "#FFC107" },
    Done: { title: "Done", items: [], color: "#28A745" },
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetStatus, setTargetStatus] = useState("To Do");
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    priority: "Medium",
    projectId: selectedBatch?.projectId || "",
    assignedTo: [],
    taskImage: [],
    images: [],
    Task: "",
    comments: 0,
    files: 0,
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({
    taskImage: false,
    images: false,
  });
  const modalRef = useRef(null);

  // Debug theme context
  useEffect(() => {
    console.log("Theme:", { backgroundColor, fontColor, customColor, mode });
  }, [backgroundColor, fontColor, customColor, mode]);

  // Auto-select first batch
  useEffect(() => {
    if (isContextReady && batches.length && !selectedBatch) {
      selectBatch(batches[0]);
    }
  }, [isContextReady, batches, selectedBatch, selectBatch]);

  // Sync columns with tasks
  useEffect(() => {
    if (!isContextReady || !selectedBatch) return;
    const filteredTasks = tasks.filter((t) => t.batchId === selectedBatch.id);
    setColumns({
      "To Do": {
        title: "To Do",
        items: filteredTasks.filter((t) => t.status === "To Do"),
        color: "#FF5733",
      },
      "In Progress": {
        title: "In Progress",
        items: filteredTasks.filter((t) => t.status === "In Progress"),
        color: "#FFC107",
      },
      Done: {
        title: "Done",
        items: filteredTasks.filter((t) => t.status === "Done"),
        color: "#28A745",
      },
    });
  }, [tasks, selectedBatch, isContextReady]);

  // Focus trap for modal
  useEffect(() => {
    if (showTaskModal && modalRef.current) {
      modalRef.current.focus();
      const trapFocus = (e) => {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener("keydown", trapFocus);
      return () => document.removeEventListener("keydown", trapFocus);
    }
  }, [showTaskModal]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      [destination.droppableId]: { ...destColumn, items: destItems },
    });

    try {
      updateTaskStatus(removed.id, destination.droppableId);
      toast.success("Task status updated", { autoClose: 3000 });
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to move task", { autoClose: 3000 });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e, field) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    setUploading({ ...uploading, [field]: true });
    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image (JPEG, PNG, GIF only)`, {
          autoClose: 3000,
        });
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 5MB limit`, { autoClose: 3000 });
        return false;
      }
      return true;
    });
    try {
      const urls = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );
      setFormData({ ...formData, [field]: urls });
    } finally {
      setUploading({ ...uploading, [field]: false });
    }
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
        comments: Number(formData.comments),
        files: Number(formData.files),
      };
      try {
        if (isEditMode) {
          updateTask(editingTask.id, taskData);
          toast.success("Task updated successfully", { autoClose: 3000 });
        } else {
          addTask(taskData);
          toast.success("Task added successfully", { autoClose: 3000 });
        }
        closeModal();
      } catch (error) {
        toast.error(`Failed to ${isEditMode ? "update" : "add"} task`, {
          autoClose: 3000,
        });
      }
    }
  };

  const closeModal = () => {
    setShowTaskModal(false);
    setIsEditMode(false);
    setEditingTask(null);
    setFormData({
      name: "",
      dueDate: "",
      priority: "Medium",
      projectId: selectedBatch?.projectId || "",
      assignedTo: [],
      taskImage: [],
      images: [],
      Task: "",
      comments: 0,
      files: 0,
    });
    setTargetStatus("To Do");
    setErrors({});
  };

  const handleEditTask = (task) => {
    setIsEditMode(true);
    setEditingTask(task);
    setFormData({
      name: task.name || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "Medium",
      projectId: task.projectId || selectedBatch?.projectId || "",
      assignedTo: task.assignedTo || [],
      taskImage: task.taskImage || [],
      images: task.images || [],
      Task: task.Task || "",
      comments: task.comments || 0,
      files: task.files || 0,
    });
    setTargetStatus(task.status || "To Do");
    setShowTaskModal(true);
  };

  const handleBatchChange = (event, value) => {
    if (value) selectBatch(value);
  };

  const handleAddButtonKeyDown = (e, columnId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setTargetStatus(columnId);
      setShowTaskModal(true);
    }
  };

  if (!isContextReady || !batches.length || !selectedBatch) {
    return (
      <Container
        // backgroundColor={backgroundColor}
        fontColor={fontColor}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center items-center h-screen">
          <CircularProgress style={{ color: customColor, backgroundColor }} />
        </div>
      </Container>
    );
  }

  return (
    <div
      //   backgroundColor={backgroundColor}
      fontColor={fontColor}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 rounded-xl shadow-lg mb-11"
      style={{ backgroundColor: `${customColor}22`, color: fontColor }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex p-4 flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
        style={{
          //   border: `1px solid ${customColor}`,
          backgroundColor: `${backgroundColor}cc`,
          color: fontColor,
        }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl font-extrabold"
          style={{
            // backgroundColor: `${backgroundColor}cc`,
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
        <ColumnsGrid
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.2 }}
        >
          {Object.entries(columns).map(([columnId, column], index) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDark={mode === "dark"}
                  customColor={customColor}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  aria-labelledby={`col-${columnId}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ul className="list-disc">
                        <li
                          style={{ color: column.color }}
                          className="ml-5 px-3 py-1"
                        >
                          <span
                            id={`col-${columnId}`}
                            className={`transition-colors duration-300 cursor-pointer`}
                            style={{
                              color: `${fontColor}`,
                              //   background: backgroundColor,
                            }}
                          >
                            {column?.title}
                          </span>
                        </li>
                      </ul>
                      <div
                        style={{ background: `${backgroundColor}` }}
                        className=" rounded-full h-5 w-5 flex justify-center items-center p-3 ml-2"
                      >
                        <div>{column?.items?.length}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTargetStatus(columnId);
                          setShowTaskModal(true);
                        }}
                        onKeyDown={(e) => handleAddButtonKeyDown(e, columnId)}
                        className={`p-2 rounded-full hover:bg-[${backgroundColor}3]`}
                        style={{ color: fontColor }}
                        aria-label={`Add task to ${column.title}`}
                      >
                        <FaPlus className="w-4 h-4" />
                      </button>
                      <div className="text-[#787486] cursor-pointer">...</div>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "2px solid",
                      borderColor: column.color,
                    }}
                    className="mt-5"
                  ></div>
                  {column.items.map((item, index) => (
                    <TaskCard
                      key={item.id}
                      item={item}
                      index={index}
                      onEdit={() => handleEditTask(item)}
                    />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          ))}
        </ColumnsGrid>
      </DragDropContext>
      {showTaskModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ backgroundColor: `${backgroundColor}cc` }}
        >
          <ModalContent
            ref={modalRef}
            backgroundColor={backgroundColor}
            fontColor={fontColor}
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 id="modal-title" className="text-xl font-bold mb-6">
              {isEditMode ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Task Details</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 `}
                    style={{
                      backgroundColor: `${backgroundColor}12`,
                      color: fontColor,
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="Task"
                    value={formData.Task}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 "
                    rows={3}
                    style={{
                      backgroundColor: `${backgroundColor}12`,
                      color: fontColor,
                    }}
                    aria-describedby="description-help"
                  />
                  <p
                    id="description-help"
                    className="text-gray-500 text-sm mt-1"
                  >
                    Optional: Enter a task description.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]`}
                    style={{
                      "--theme-color": customColor,
                      backgroundColor: `#${backgroundColor}cc`,
                      color: fontColor,
                      borderColor: errors.dueDate ? "red" : "",
                    }}
                    aria-invalid={!!errors.dueDate}
                    aria-describedby="dueDate-error"
                  />
                  {errors.dueDate && (
                    <p id="dueDate-error" className="text-red-500 text-sm mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]"
                    style={{
                      backgroundColor: `#${backgroundColor}cc`,
                      color: fontColor,
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project
                  </label>
                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]"
                    style={{
                      backgroundColor: `#${backgroundColor}cc`,
                      color: fontColor,
                      borderColor: errors.projectId ? "red" : "",
                    }}
                    aria-invalid={!!errors.projectId}
                    aria-describedby="projectId-error"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.projectId && (
                    <p
                      id="projectId-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.projectId}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Images</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task Images
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      multiple
                      onChange={(e) => handleFileChange(e, "taskImage")}
                      className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]"
                      disabled={uploading.taskImage}
                      aria-describedby="task-image-help"
                    />
                    {uploading.taskImage && (
                      <CircularProgress
                        size={24}
                        className="absolute right-4 top-3"
                        style={{ color: customColor }}
                      />
                    )}
                  </div>
                  <p
                    id="task-image-help"
                    className="text-gray-500 text-sm mt-1"
                  >
                    Optional: Upload images (JPEG, PNG, GIF; max 5MB each).
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assignee Avatars
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      multiple
                      onChange={(e) => handleFileChange(e, "images")}
                      className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]"
                      disabled={uploading.images}
                      aria-describedby="avatars-help"
                    />
                    {uploading.images && (
                      <CircularProgress
                        size={24}
                        className="absolute right-4 top-3"
                        style={{ color: customColor }}
                      />
                    )}
                  </div>
                  <p id="avatars-help" className="text-gray-500 text-sm mt-1">
                    Optional: Upload avatar images (JPEG, PNG, GIF; max 5MB
                    each).
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">
                  Assignees & Column
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assignees
                  </label>
                  <div
                    className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3"
                    style={{
                      borderColor: errors.assignedTo
                        ? "red"
                        : `#${fontColor}33`,
                    }}
                  >
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`assignee-${member.id}`}
                          checked={formData.assignedTo.includes(member.id)}
                          onChange={() => handleAssignedToToggle(member.id)}
                          className="mr-2 h-4 w-4 text-[var(--theme-color, ${customColor})] focus:ring-[var(--theme-color, ${customColor})]"
                        />
                        <label
                          htmlFor={`assignee-${member.id}`}
                          className="text-sm"
                        >
                          {member.name} ({member.role})
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.assignedTo && (
                    <p
                      id="assignedTo-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.assignedTo}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Add to Column
                  </label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    className="w-full p-3 rounded-md  border border-gray-300 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]"
                    style={{
                      backgroundColor: `#${backgroundColor}cc`,
                      color: fontColor,
                    }}
                  >
                    {Object.keys(columns).map((colId) => (
                      <option key={colId} value={colId}>
                        {columns[colId].title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-white hover:bg-opacity-90 focus:ring-2 focus:ring-[var(--theme-color, ${customColor})]"
                  style={{ backgroundColor: customColor }}
                  disabled={uploading.taskImage || uploading.images}
                >
                  {isEditMode ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 text-center text-sm"
        style={{ color: `#${fontColor}aa` }}
      >
        <p>Drag tasks to update status or manage your workflow.</p>
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Board;
