import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    currentPassword: "",
    newPassword: "",
  });

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const [activeSection, setActiveSection] = useState<
    "name" | "username" | "password" | ""
  >("");
  const [loading, setLoading] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSection = (section: "name" | "username" | "password") => {
    setActiveSection((prev) => (prev === section ? "" : section));
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.warning("Name cannot be empty");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { _id } = loggedUser;
      const name = formData.name.trim();
      const response = await axios.put(`${apiUrl}/update/name`, { name, _id });

      if (response.status !== 200) {
        return toast.error("Error while updating name");
      }

      toast.success("Name updated successfully!");
      setFormData((prev) => ({ ...prev, name: "" }));
      const updatedUser = { ...loggedUser, name };
      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      toast.error("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (!formData.username) {
      toast.warning("Username cannot be empty");
      setLoading(false);
      return;
    }
    try {
      const { _id } = loggedUser;
      const username = formData.username.replace(/\s+/g, "");
      const response = await axios.put(`${apiUrl}/update/username`, {
        username,
        _id,
      });

      if (response.status !== 200) {
        return toast.error("Error while updating username");
      }

      toast.success("Username updated successfully!");
      setFormData((prev) => ({ ...prev, username: "" }));
      const updatedUser = { ...loggedUser, username };
      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      toast.error("Failed to update username");
    } finally{
      setLoading(false)
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (!formData.newPassword || !formData.currentPassword) {
      toast.warning("Password fields are empty!");
      setLoading(false);
      return;
    }
    try {
      const _id = loggedUser._id;
      const response = await axios.put(`${apiUrl}/update/password`, {
        _id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status !== 200) {
        return toast.error("Error while updating password");
      }

      toast.success("Password updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error: any) {
      if (error.response?.status === 450) {
        toast.error("Incorrect current password");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Validation error");
      } else {
        toast.error("Failed to update password");
      }
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Settings
      </h1>

      {/* Change Name */}
      <div className="mb-6 border border-gray-200 rounded-lg p-4">
        <button
          className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
          onClick={() => toggleSection("name")}
        >
          Change Name
        </button>
        {activeSection === "name" && (
          <form onSubmit={handleNameUpdate} className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="New name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:cursor-not-allowed bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? <span className="loader p-1 mr-2" /> : "Update Name"}
            </button>
          </form>
        )}
      </div>

      {/* Change Username */}
      <div className="mb-6 border border-gray-200 rounded-lg p-4">
        <button
          className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
          onClick={() => toggleSection("username")}
        >
          Change Username
        </button>
        {activeSection === "username" && (
          <form onSubmit={handleUsernameUpdate} className="mt-4 space-y-3">
            <input
              type="text"
              name="username"
              placeholder="New username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:cursor-not-allowed bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? <span className="loader p-1 mr-2" /> : "Update username"}
            </button>
          </form>
        )}
      </div>

      {/* Change Password */}
      <div className="mb-6 border border-gray-200 rounded-lg p-4">
        <button
          className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
          onClick={() => toggleSection("password")}
        >
          Change Password
        </button>
        {activeSection === "password" && (
          <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-3">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:cursor-not-allowed bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? <span className="loader p-1 mr-2" /> : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
