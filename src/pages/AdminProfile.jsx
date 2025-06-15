import React from "react";
import { useTheme } from "../context/TC";

const AdminProfile = () => {
  const { backgroundColor, fontColor, customColor } = useTheme();
  return (
    <div
      className="p-6 rounded-xl shadow-lg"
      style={{ backgroundColor, color: fontColor }}
    >
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      <div
        className="p-4 rounded-lg"
        style={{ border: `2px solid ${customColor}` }}
      >
        <p>Manage admin settings and profile details here.</p>
        {/* Add profile form or details */}
      </div>
    </div>
  );
};

export default AdminProfile;
