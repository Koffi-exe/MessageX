import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chats" | "profile" | "settings">(
    "chats"
  );
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("chats")}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "chats" ? "bg-gray-700" : ""
            }`}
          >
            📨 Global Chat
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "profile" ? "bg-gray-700" : ""
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "settings" ? "bg-gray-700" : ""
            }`}
          >
            ⚙️ Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {activeTab === "chats" && <Chat />}
        {activeTab === "profile" && <Profile />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default Dashboard;


const Profile = () => (
  <div>
    <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
    <p>View or edit your user details here.</p>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <p>Adjust your preferences here.</p>
      <button
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
        onClick={() => {
          localStorage.removeItem("loggedUser");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};
