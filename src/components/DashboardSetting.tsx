import React, { useState } from "react";
import axios from "axios";

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
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSection = (section: "name" | "username" | "password") => {
    setActiveSection((prev) => (prev === section ? "" : section));
    setMessage("");
    setStatus("");
    setPasswordError("");
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { _id } = loggedUser;
      const name = formData.name.trim();
      const response = await axios.put(`${apiUrl}/update/name`, { name, _id });

      if (response.status !== 200) {
        return setMessage("Error while updating name");
      }

      setStatus("Name updated successfully!");
      setFormData((prev) => ({ ...prev, name: "" }));
      const updatedUser = { ...loggedUser, name };
      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      setMessage("Failed to update name");
    } finally {
      setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 5000);
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { _id } = loggedUser;
      const username = formData.username.replace(/\s+/g, "");
      const response = await axios.put(`${apiUrl}/update/username`, {
        username,
        _id,
      });

      if (response.status !== 200) {
        return setMessage("Error while updating username");
      }

      setStatus("Username updated successfully!");
      setFormData((prev) => ({ ...prev, username: "" }));
      const updatedUser = { ...loggedUser, username };
      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      setMessage("Failed to update username");
    } finally {
      setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 5000);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    try {
      const _id = loggedUser._id;
      const response = await axios.put(`${apiUrl}/update/password`, {
        _id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.status !== 200) {
        return setMessage("Error while updating password");
      }

      setStatus("Password updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error: any) {
      if (error.response?.status === 450) {
        setPasswordError("Incorrect current password");
      } else if (error.response?.status === 400) {
        setPasswordError(error.response.data.message || "Validation error");
      } else {
        setMessage("Failed to update password");
      }
      console.log(error);
    } finally {
      setTimeout(() => {
        setMessage("");
        setStatus("");
        setPasswordError("");
      }, 5000);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      {/* Change Name */}
      <div className="mb-4 border p-4 rounded">
        <button
          className="text-lg font-medium mb-2"
          onClick={() => toggleSection("name")}
        >
          Change Name
        </button>
        {activeSection === "name" && (
          <form onSubmit={handleNameUpdate} className="space-y-3 mt-2">
            <input
              type="text"
              name="name"
              placeholder="New name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Update Name
            </button>
          </form>
        )}
      </div>

      {/* Change Username */}
      <div className="mb-4 border p-4 rounded">
        <button
          className="text-lg font-medium mb-2"
          onClick={() => toggleSection("username")}
        >
          Change Username
        </button>
        {activeSection === "username" && (
          <form className="space-y-3 mt-2" onSubmit={handleUsernameUpdate}>
            <input
              type="text"
              name="username"
              placeholder="New username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Update Username
            </button>
          </form>
        )}
      </div>

      {/* Change Password */}
      <div className="mb-4 border p-4 rounded">
        <button
          className="text-lg font-medium mb-2"
          onClick={() => toggleSection("password")}
        >
          Change Password
        </button>
        {activeSection === "password" && (
          <form onSubmit={handlePasswordUpdate} className="space-y-3 mt-2">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

      {/* Message Feedback */}
      {status && (
        <p className="text-green-600 text-sm text-center mt-4">{status}</p>
      )}
      {message && (
        <p className="text-red-600 text-sm text-center mt-4">{message}</p>
      )}
      {passwordError && (
        <p className="text-red-600 text-sm text-center mt-4">{passwordError}</p>
      )}
    </div>
  );
};

export default Settings;
