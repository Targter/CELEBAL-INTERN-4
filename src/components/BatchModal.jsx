import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useTheme } from "../context/TC";

const BatchModal = ({ batch, onClose }) => {
  const { addBatch, updateBatch, projects, members } = useAppContext();
  // const { projects, members, addBatch, updateBatch } = useAppContext();
  const { backgroundColor, fontColor, customColor } = useTheme();
  const [name, setName] = useState(batch?.name || "");
  const [projectId, setProjectId] = useState(batch?.projectId || "");
  const [selectedMembers, setSelectedMembers] = useState(batch?.members || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !projectId || !selectedMembers.length) {
      toast.error("Please fill all required fields", { autoClose: 3000 });
      return;
    }
    const batchData = {
      name,
      projectId: parseInt(projectId),
      members: selectedMembers.map(Number),
    };
    if (batch) {
      updateBatch(batch.id, batchData);
    } else {
      addBatch(batchData);
    }
    onClose();
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0  flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className=" p-6 rounded-xl shadow-lg w-full max-w-md"
        style={{ backgroundColor: `${backgroundColor}` }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {batch ? "Edit Batch" : "Add Batch"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Batch Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="blockmb-2">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full p-2 border border-gray-300"
              required
              style={{ color: `${fontColor}`, backgroundColor }}
              disabled={!projects.length}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {!projects.length && (
              <p className="text-red-500 text-sm mt-1">
                No projects available. Create a project first.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block  mb-2">Members</label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded p-2 ">
              {members.length ? (
                members.map((m) => (
                  <div key={m.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                      className="rounded"
                    />
                    <label className="">
                      {m.name} ({m.role})
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm">No members available.</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-red-500 "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2  rounded hover:bg-opacity-90 bg-green-800"
              disabled={!projects.length || !members.length}
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BatchModal;
