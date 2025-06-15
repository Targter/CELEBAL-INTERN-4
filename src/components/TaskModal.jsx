import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

const TaskModal = ({ onClose, targetStatus = "To Do" }) => {
  const { addTask, batches, projects, members, selectedBatch } =
    useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    priority: "Medium",
    projectId: selectedBatch?.projectId || "",
    batchId: selectedBatch?.id || "",
    assignedTo: [],
    status: targetStatus,
  });
  const [errors, setErrors] = useState({});

  // Update formData when selectedBatch
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      batchId: selectedBatch?.id || "",
      projectId: selectedBatch?.projectId || "",
    }));
  }, [selectedBatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignedToToggle = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter((id) => id !== memberId)
        : [...prev.assignedTo, memberId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.batchId) newErrors.batchId = "Batch is required";
    if (!formData.projectId) newErrors.projectId = "Project is required";
    if (!formData.assignedTo.length)
      newErrors.assignedTo = "At least one assignee is required";
    if (
      formData.dueDate &&
      new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)
    ) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    if (!batches.find((b) => b.id === parseInt(formData.batchId))) {
      newErrors.batchId = "Invalid batch selected";
    }
    if (!projects.find((p) => p.id === parseInt(formData.projectId))) {
      newErrors.projectId = "Invalid project selected";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors", { autoClose: 5000 });
      return;
    }
    const taskData = {
      name: formData.name,
      status: formData.status,
      dueDate: formData.dueDate,
      priority: formData.priority,
      batchId: parseInt(formData.batchId),
      projectId: parseInt(formData.projectId),
      assignedTo: formData.assignedTo,
    };
    console.log("Adding task:", taskData);
    try {
      addTask(taskData);
      toast.success(
        `Task "${taskData.name}" assigned to batch ${
          batches.find((b) => b.id === taskData.batchId)?.name
        }`,
        { autoClose: 5000 }
      );
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task", { autoClose: 5000 });
    }
  };

  const closeModal = () => {
    setFormData({
      name: "",
      dueDate: "",
      priority: "Medium",
      projectId: selectedBatch?.projectId || "",
      batchId: selectedBatch?.id || "",
      assignedTo: [],
      status: targetStatus,
    });
    setErrors({});
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md"
      style={{ backgroundColor: `${backgroundColor}80` }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="p-6 rounded-xl shadow-lg w-full max-w-md"
        style={{ backgroundColor, color: fontColor }}
      >
        <h3 className="text-lg font-semibold mb-4">
          Add Task to {formData.status}
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
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 rounded-lg"
              style={{
                backgroundColor: `${backgroundColor}cc`,
                color: fontColor,
                borderColor: `${fontColor}33`,
              }}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
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
              required
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
            <label className="block mb-1">Batch</label>
            <select
              name="batchId"
              value={formData.batchId}
              onChange={handleInputChange}
              className="w-full p-2 rounded-lg"
              style={{
                backgroundColor: `${backgroundColor}cc`,
                color: fontColor,
                borderColor: `${fontColor}33`,
              }}
              required
              disabled={!batches.length}
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.batchId && (
              <p className="text-red-500 text-sm mt-1">{errors.batchId}</p>
            )}
            {!batches.length && (
              <p className="text-red-500 text-sm mt-1">
                No batches available. Create a batch first.
              </p>
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
              required
              disabled={!projects.length}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
            )}
            {!projects.length && (
              <p className="text-red-500 text-sm mt-1">
                No projects available. Create a project first.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Assigned To</label>
            <div
              className="max-h-40 overflow-y-auto border rounded-lg p-2"
              style={{ borderColor: `${fontColor}33` }}
            >
              {members.length ? (
                members.map((m) => (
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
                ))
              ) : (
                <p className="text-red-500 text-sm">
                  No members available. Add members first.
                </p>
              )}
            </div>
            {errors.assignedTo && (
              <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
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
              disabled={!batches.length || !projects.length || !members.length}
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskModal;
