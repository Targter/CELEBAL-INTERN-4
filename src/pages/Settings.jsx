import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { FaSave, FaUndo, FaTimes, FaInfoCircle } from "react-icons/fa";

const Settings = () => {
  const { members, batches, selectedBatch, selectBatch, isContextReady } =
    useAppContext();
  const {
    backgroundColor,
    fontColor,
    customColor,
    setMode,
    mode,
    setCustomColor,
  } = useTheme();
  const [settings, setSettings] = useState({
    name: "Abhay Bansal",
    email: "",
    role: "",
    theme: "light",
    accentColor: customColor,
    emailNotifications: true,
    inAppNotifications: true,
    defaultBatchId: selectedBatch?.id || "",
  });
  const [initialSettings, setInitialSettings] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (isContextReady && members.length) {
      // const user = members[0];
      const initial = {
        name: "Abhay Bansal",
        email: "bansalabhay00@gmail.com",
        role: "Full-Stack Developer",
        theme: "light",
        accentColor: customColor,
        emailNotifications: true,
        inAppNotifications: true,
        defaultBatchId: selectedBatch?.id || "",
      };
      setSettings(initial);
      setInitialSettings(initial);
    }
  }, [isContextReady, members, selectedBatch, customColor]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateSettings = () => {
    const errors = {};
    if (!settings.name) errors.name = "Name is required";
    if (!settings.email || !/\S+@\S+\.\S+/.test(settings.email))
      errors.email = "Valid email is required";
    if (
      settings.defaultBatchId &&
      !batches.find((b) => b.id === parseInt(settings.defaultBatchId))
    )
      errors.defaultBatchId = "Invalid batch selected";
    return errors;
  };

  const handleSave = () => {
    const errors = validateSettings();
    if (Object.keys(errors).length) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }
    // Mock save: Update context or API
    if (settings.defaultBatchId) {
      const batch = batches.find(
        (b) => b.id === parseInt(settings.defaultBatchId)
      );
      if (batch) selectBatch(batch);
    }
    // TODO: Persist theme/accentColor via Themecontext
    console.log("Saving settings:", settings);
    toast.success("Settings saved successfully");
    setInitialSettings(settings);
    setShowConfirmModal(false);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    toast.info("Settings reset to last saved values");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  if (!isContextReady || !members.length) {
    return (
      <div className="p-6 text-center" style={{ color: fontColor }}>
        Loading settings...
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
      {/* Header */}
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
          Company Settings
        </h1>
        <p className="mt-2 text-lg" style={{ color: `${fontColor}cc` }}>
          Customize your project management experience. Adjust your profile,
          theme, notifications, and team preferences to optimize your workflow.
        </p>
      </motion.div>

      {/* Settings Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-xl shadow-lg"
        style={{ backgroundColor: `${backgroundColor}ee` }}
      >
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: fontColor }}
            >
              Profile
              <FaInfoCircle
                className="ml-2 w-4 h-4 opacity-50"
                title="Update your account details"
              />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: fontColor }}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Abhay Bansal"
                  name="name"
                  value={settings.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: fontColor }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: fontColor }}
                >
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={settings.role}
                  readOnly
                  className="w-full p-2 rounded-lg text-sm opacity-70 cursor-not-allowed"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Theme Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: fontColor }}
            >
              Theme
              <FaInfoCircle
                className="ml-2 w-4 h-4 opacity-50"
                title="Customize app appearance"
              />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: fontColor }}
                >
                  Theme Mode
                </label>
                <select
                  name="theme"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full p-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${backgroundColor}cc`,
                    color: fontColor,
                    borderColor: `${fontColor}33`,
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: fontColor }}
                >
                  Accent Color
                </label>
                <input
                  type="color"
                  name="accentColor"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full p-1 rounded-lg h-10"
                  style={{ borderColor: `${fontColor}33` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: fontColor }}
            >
              Notifications
              <FaInfoCircle
                className="ml-2 w-4 h-4 opacity-50"
                title="Manage alert preferences"
              />
            </h2>
            <div className="space-y-2">
              <label
                className="flex items-center text-sm"
                style={{ color: fontColor }}
              >
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Receive email notifications
              </label>
              <label
                className="flex items-center text-sm"
                style={{ color: fontColor }}
              >
                <input
                  type="checkbox"
                  name="inAppNotifications"
                  checked={settings.inAppNotifications}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Receive in-app notifications
              </label>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h2
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: fontColor }}
            >
              Team Preferences
              <FaInfoCircle
                className="ml-2 w-4 h-4 opacity-50"
                title="Set default team settings"
              />
            </h2>
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: fontColor }}
              >
                Default Batch
              </label>
              <select
                name="defaultBatchId"
                value={settings.defaultBatchId}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg text-sm"
                style={{
                  backgroundColor: `${backgroundColor}cc`,
                  color: fontColor,
                  borderColor: `${fontColor}33`,
                }}
                disabled={!batches.length}
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {!batches.length && (
                <p
                  className="text-red-500 text-sm mt-1"
                  style={{ color: `${fontColor}cc` }}
                >
                  No batches available. Create a batch in the Dashboard.
                </p>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="flex justify-end space-x-4"
          >
            <motion.button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg flex items-center"
              style={{
                backgroundColor: `${fontColor}33`,
                color: fontColor,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUndo className="mr-2 w-4 h-4" />
              Reset
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 rounded-lg text-white flex items-center"
              style={{ backgroundColor: customColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave className="mr-2 w-4 h-4" />
              Save Changes
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
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
              className="p-6 rounded-xl shadow-lg w-full max-w-md"
              style={{ backgroundColor, color: fontColor }}
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Changes</h3>
              <p className="text-sm mb-4" style={{ color: `${fontColor}cc` }}>
                Are you sure you want to save these settings? This will update
                your profile, theme, notifications, and team preferences.
              </p>
              <div className="flex justify-end space-x-2">
                <motion.button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg flex items-center"
                  style={{
                    backgroundColor: `${fontColor}33`,
                    color: fontColor,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="mr-2 w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg text-white flex items-center"
                  style={{ backgroundColor: customColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave className="mr-2 w-4 h-4" />
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-sm" style={{ color: `${fontColor}aa` }}>
          Your settings are securely stored and can be updated anytime. Contact
          support for advanced configuration options.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
