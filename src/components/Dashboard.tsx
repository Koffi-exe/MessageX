import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./GlobalChat";
import PrivateRoom from "./PrivateRoom";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "Chats" | "Private Room" | "Profile" | "Settings"
  >("Chats");
  const [roomId, setRoomId] = useState("");
  const [inputId, setInputId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Toggle */}
      <div className="md:hidden flex justify-between items-center bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gray-800 text-white p-4 space-y-6`}
      >
        <h2 className="text-2xl font-bold mb-4 hidden md:block">Dashboard</h2>
        <nav className="space-y-3">
          <button
            onClick={() => {
              setActiveTab("Chats");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "Chats" ? "bg-gray-700" : ""
            }`}
          >
            📨 Global Chat
          </button>
          <button
            onClick={() => {
              setActiveTab("Private Room");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "Private Room" ? "bg-gray-700" : ""
            }`}
          >
            📨 Private Room
          </button>
          <button
            onClick={() => {
              setActiveTab("Profile");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "Profile" ? "bg-gray-700" : ""
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => {
              setActiveTab("Settings");
              setSidebarOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "Settings" ? "bg-gray-700" : ""
            }`}
          >
            ⚙️ Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        {activeTab === "Chats" && <Chat />}
        {activeTab === "Private Room" && (
          <>
            {!roomId && (
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className=" p-2 border rounded w-full max-w-xs"
                />
                <button
                  className="p-2 text-white ml-0 md:ml-3  md:mt-0 rounded bg-blue-600 hover:bg-blue-700 transition"
                  onClick={() => setRoomId(inputId)}
                >
                  Create Room
                </button>
              </div>
            )}
            {roomId && <PrivateRoom roomId={roomId} />}
          </>
        )}
        {activeTab === "Profile" && <Profile />}
        {activeTab === "Settings" && <Settings />}
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
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white mt-4"
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
