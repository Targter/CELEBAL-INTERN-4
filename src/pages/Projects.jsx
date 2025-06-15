import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { format, isBefore, isAfter } from "date-fns";

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } =
    useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    milestones: [],
  });
  const [errors, setErrors] = useState({});
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const today = new Date();

  // status
  const getProjectStatus = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isAfter(start, today)) return "Upcoming";
    if (isBefore(end, today)) return "Completed";
    return "Active";
  };

  // milestone
  const getProgress = (milestones) => {
    if (!milestones.length) return 0;
    const completed = milestones.filter((m) =>
      isBefore(new Date(m.date), today)
    ).length;
    return (completed / milestones.length) * 100;
  };

  // Filter project
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  // Paginate
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(
      (p) => getProjectStatus(p.startDate, p.endDate) === "Active"
    ).length;
    const upcomingMilestones = projects.reduce(
      (sum, p) =>
        sum +
        p.milestones.filter((m) => isAfter(new Date(m.date), today)).length,
      0
    );
    const lastUpdated = format(today, "MMM dd, yyyy");
    return { totalProjects, activeProjects, upcomingMilestones, lastUpdated };
  }, [projects]);

  // CSV data
  const csvData = useMemo(() => {
    return [
      ...projects.map((p) => ({
        Name: p.name,
        Description: p.description,
        "Start Date": p.startDate,
        "End Date": p.endDate,
        Status: getProjectStatus(p.startDate, p.endDate),
        "Milestone Count": p.milestones.length,
        Progress: `${getProgress(p.milestones).toFixed(2)}%`,
      })),
      {},
      {
        Name: "Metrics",
        Description: "",
        "Start Date": "",
        "End Date": "",
        Status: "",
        "Milestone Count": "",
        Progress: "",
      },
      {
        Name: "Total Projects",
        Description: metrics.totalProjects,
        "Start Date": "",
        "End Date": "",
        Status: "",
        "Milestone Count": "",
        Progress: "",
      },
      {
        Name: "Active Projects",
        Description: metrics.activeProjects,
        "Start Date": "",
        "End Date": "",
        Status: "",
        "Milestone Count": "",
        Progress: "",
      },
      {
        Name: "Upcoming Milestones",
        Description: metrics.upcomingMilestones,
        "Start Date": "",
        "End Date": "",
        Status: "",
        "Milestone Count": "",
        Progress: "",
      },
      {
        Name: "Last Updated",
        Description: metrics.lastUpdated,
        "Start Date": "",
        "End Date": "",
        Status: "",
        "Milestone Count": "",
        Progress: "",
      },
    ];
  }, [projects, metrics]);

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelected = new Set(paginatedProjects.map((p) => p.id));
      setSelectedProjects(newSelected);
    } else {
      setSelectedProjects(new Set());
    }
  };

  // Handle individual project selection
  const handleSelectProject = (projectId) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedProjects.size} project(s)?`
      )
    ) {
      selectedProjects.forEach((id) => deleteProject(id));
      setSelectedProjects(new Set());
      toast.success("Selected projects deleted successfully!");
    }
  };

  // Handle single project delete
  const handleDelete = (projectId, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      deleteProject(projectId);
      toast.success(`Project "${projectName}" deleted successfully!`);
    }
  };

  // Handle edit project
  const handleEdit = (project) => {
    setModalMode("edit");
    setSelectedProjectId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      milestones: project.milestones || [],
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle milestone changes
  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = formData.milestones.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  // Add new milestone
  const addMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { name: "", date: "" }],
    });
  };

  // Remove milestone
  const removeMilestone = (index) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter((_, i) => i !== index),
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }
    const milestoneNames = new Set();
    formData.milestones.forEach((m, i) => {
      if (!m.name) {
        newErrors[`milestoneName${i}`] = "Milestone name is required";
      } else if (milestoneNames.has(m.name)) {
        newErrors[`milestoneName${i}`] = "Milestone name must be unique";
      } else {
        milestoneNames.add(m.name);
      }
      if (!m.date) {
        newErrors[`milestoneDate${i}`] = "Milestone date is required";
      } else if (
        new Date(m.date) < new Date(formData.startDate) ||
        new Date(m.date) > new Date(formData.endDate)
      ) {
        newErrors[`milestoneDate${i}`] =
          "Milestone date must be between start and end dates";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (modalMode === "add") {
        addProject(formData);
        toast.success("Project added successfully!");
      } else {
        updateProject(selectedProjectId, formData);
        toast.success("Project updated successfully!");
      }
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        milestones: [],
      });
      setErrors({});
      setModalMode("add");
      setSelectedProjectId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      milestones: [],
    });
    setErrors({});
    setModalMode("add");
    setSelectedProjectId(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedProjects(new Set());
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
    setSelectedProjects(new Set());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 rounded-xl shadow-lg"
      style={{ backgroundColor, color: fontColor }}
    >
      {/* Header and Description */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Projects</h2>
          <button
            onClick={() => {
              setModalMode("add");
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors flex items-center text-sm"
            style={{ backgroundColor: customColor }}
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add Project
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: `${fontColor}aa` }}>
          Manage your projects, track milestones, and monitor progress. Add,
          edit, or delete projects to organize your team's workflow.
        </p>
      </motion.div>

      {/* Search and Export */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4"
      >
        <input
          type="text"
          placeholder="Search projects by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3 p-2 rounded-lg text-sm"
          style={{
            backgroundColor: `${backgroundColor}cc`,
            color: fontColor,
            borderColor: `${fontColor}33`,
          }}
        />
        <div className="flex items-center gap-4">
          {selectedProjects.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm flex items-center"
              style={{ backgroundColor: "#ef4444" }}
            >
              <FaTrash className="w-4 h-4 mr-2" /> Delete Selected (
              {selectedProjects.size})
            </button>
          )}
          <CSVLink
            data={csvData}
            filename="projects-report.csv"
            className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm flex items-center"
            style={{ backgroundColor: customColor }}
          >
            Export CSV
          </CSVLink>
        </div>
      </motion.div>

      {/* Project Table */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="overflow-x-auto"
      >
        {paginatedProjects.length === 0 ? (
          <p
            className="text-center text-sm p-4"
            style={{ color: `${fontColor}aa` }}
          >
            No projects found. Add a project to get started.
          </p>
        ) : (
          <table
            className="w-full text-left"
            role="grid"
            aria-label="Projects List"
            style={{ color: fontColor }}
          >
            <thead className="sticky top-0" style={{ backgroundColor }}>
              <tr>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedProjects.size === paginatedProjects.length &&
                      paginatedProjects.length > 0
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all projects"
                  />
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Name
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Description
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Start Date
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  End Date
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Status
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Milestones
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Progress
                </th>
                <th
                  className="p-4 border-b"
                  style={{ borderColor: `${fontColor}33` }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-opacity-10 transition-colors"
                  style={{ backgroundColor: `${customColor}10` }}
                >
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProjects.has(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      aria-label={`Select project ${project.name}`}
                    />
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    {project.name}
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    {project.description}
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    {project.startDate}
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    {project.endDate}
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        getProjectStatus(project.startDate, project.endDate) ===
                        "Active"
                          ? "bg-green-100 text-green-800"
                          : getProjectStatus(
                              project.startDate,
                              project.endDate
                            ) === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getProjectStatus(project.startDate, project.endDate)}
                    </span>
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    {project.milestones.length}
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${getProgress(project.milestones)}%`,
                          backgroundColor: customColor,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs ml-2">
                      {getProgress(project.milestones).toFixed(0)}%
                    </span>
                  </td>
                  <td
                    className="p-4 border-b"
                    style={{ borderColor: `${fontColor}33` }}
                  >
                    <button
                      onClick={() => handleEdit(project)}
                      className="mr-4 hover:underline text-sm"
                      style={{ color: customColor }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      className="hover:underline text-sm"
                      style={{ color: "#ef4444" }}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: `${fontColor}aa` }}>
              Show
            </span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-1 rounded-lg text-sm"
              style={{
                backgroundColor: `${backgroundColor}cc`,
                color: fontColor,
                borderColor: `${fontColor}33`,
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm" style={{ color: `${fontColor}aa` }}>
              per page
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
              style={{
                backgroundColor:
                  currentPage === 1 ? `${fontColor}33` : customColor,
                color: currentPage === 1 ? `${fontColor}` : "#ffffff",
              }}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === i + 1 ? "font-semibold" : ""
                }`}
                style={{
                  backgroundColor:
                    currentPage === i + 1
                      ? customColor
                      : `${backgroundColor}cc`,
                  color: currentPage === i + 1 ? "#ffffff" : fontColor,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
              style={{
                backgroundColor:
                  currentPage === totalPages ? `${fontColor}` : customColor,
                color: currentPage === totalPages ? `${fontColor}` : "#ffffff",
              }}
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Metrics */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
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
            Total Projects
          </p>
          <p className="text-lg" style={{ color: `${fontColor}` }}>
            {metrics.totalProjects}
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            Active Projects
          </p>
          <p className="text-lg" style={{ color: `${fontColor}` }}>
            {metrics.activeProjects}
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            Upcoming Milestones
          </p>
          <p className="text-lg" style={{ color: `${fontColor}` }}>
            {metrics.upcomingMilestones}
          </p>
        </div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${backgroundColor}`,
            borderColor: `${fontColor}33`,
            borderWidth: 1,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: fontColor }}>
            Last Updated
          </p>
          <p className="text-lg" style={{ color: `${fontColor}` }}>
            {metrics.lastUpdated}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-6 text-center"
      >
        <p className="text-sm" style={{ color: `${fontColor}aa` }}>
          Export project data as CSV or use the search to find specific
          projects. Select multiple projects for bulk actions.
        </p>
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 rounded-xl shadow-lg w-full max-w-md"
            style={{ backgroundColor, color: fontColor }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {modalMode === "add" ? "Add Project" : "Edit Project"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2  border rounded-lg text-sm border-gray-300 dark:border-gray-600 "
                  style={{
                    backgroundColor: `${backgroundColor}12`,
                    color: fontColor,
                    // borderColor: `black`,
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm border-gray-300 dark:border-gray-600 rounded">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 "
                  rows={3}
                  style={{
                    backgroundColor: `${backgroundColor}12`,
                    color: fontColor,
                  }}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600"
                    style={{
                      backgroundColor: `${backgroundColor}11`,
                      color: fontColor,
                    }}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600"
                    style={{
                      backgroundColor: `${backgroundColor}12`,
                      color: fontColor,
                    }}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm">Milestones</label>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="p-1.5 rounded-full hover:bg-opacity-80"
                    style={{ backgroundColor: customColor, color: "#ffffff" }}
                    aria-label="Add milestone"
                  >
                    <FaPlus className="w-3 h-3" />
                  </button>
                </div>
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start mb-2 gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Milestone Name"
                        value={milestone.name}
                        onChange={(e) =>
                          handleMilestoneChange(index, "name", e.target.value)
                        }
                        className="w-full p-2 rounded-lg text-sm mb-1 border border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundColor: `${backgroundColor}`,
                          color: fontColor,
                        }}
                      />
                      {errors[`milestoneName${index}`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`milestoneName${index}`]}
                        </p>
                      )}
                      <input
                        type="date"
                        value={milestone.date}
                        onChange={(e) =>
                          handleMilestoneChange(index, "date", e.target.value)
                        }
                        className="w-full p-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundColor: `${backgroundColor}12`,
                          color: fontColor,
                        }}
                      />
                      {errors[`milestoneDate${index}`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`milestoneDate${index}`]}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="p-2 rounded-full hover:bg-opacity-80 mt-1"
                      style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                      aria-label="Remove milestone"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors text-sm"
                  style={{
                    backgroundColor: `${fontColor}33`,
                    color: fontColor,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white hover:bg-opacity-80 transition-colors text-sm"
                  style={{ backgroundColor: customColor }}
                >
                  {modalMode === "add" ? "Add Project" : "Update Project"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Projects;
