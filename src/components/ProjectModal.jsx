import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

const ProjectModal = ({ project, onClose }) => {
  const { addProject, updateProject } = useAppContext();
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [startDate, setStartDate] = useState(
    project?.startDate ? new Date(project.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    project?.endDate ? new Date(project.endDate) : new Date()
  );
  const [milestones, setMilestones] = useState(project?.milestones || []);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { id: milestones.length + 1, name: "", date: new Date() },
    ]);
  };

  const updateMilestone = (index, field, value) => {
    const updatedMilestones = milestones.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setMilestones(updatedMilestones);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast.error("Please fill all required fields",
        { autoClose: 3000 });
      return;
    }
    if (startDate > endDate) {
      toast.error("End date must be after start date",
        { autoClose: 3000 });
      return;
    }
    const projectData = {
      name,
      description,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      milestones: milestones.map((m) => ({
        id: m.id,
        name: m.name,
        date: m.date.toISOString().split("T")[0],
      })),
    };
    if (project) {
      updateProject(project.id, projectData);
    } else {
      addProject(projectData);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {project ? "Edit Project" : "Add Project"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              Start Date
            </label>
            <DatePickerComponent
              value={startDate}
              onChange={(args) => setStartDate(args.value)}
              format="yyyy-MM-dd"
              cssClass="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2">
              End Date
            </label>
            <DatePickerComponent
              value={endDate}
              onChange={(args) => setEndDate(args.value)}
              format="yyyy-MM-dd"
              cssClass="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">
                Milestones
              </label>
              <button
                type="button"
                onClick={addMilestone}
                className="text-theme hover:text-opacity-80"
              >
                + Add Milestone
              </button>
            </div>
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="text"
                  value={milestone.name}
                  onChange={(e) =>
                    updateMilestone(index, "name", e.target.value)
                  }
                  placeholder="Milestone Name"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
                <DatePickerComponent
                  value={milestone.date}
                  onChange={(args) =>
                    updateMilestone(index, "date", args.value)
                  }
                  format="yyyy-MM-dd"
                  cssClass="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-theme text-white rounded hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
