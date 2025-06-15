import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./GlobalChat";
import PrivateRoom from "./PrivateRoom";
import Settings from "./DashboardSetting";

// Profile Component
const Profile = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const navigate = useNavigate();

  return (
    <div className="flex justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome, <span className="text-blue-600 capitalize">{loggedUser.name}</span>
        </h1>
        <div className="space-y-2">
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-gray-800">Username:</span> {loggedUser.username}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-gray-800">Email:</span> {loggedUser.email}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("loggedUser");
            navigate("/");
          }}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};



const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<
    "Home" | "Chats" | "Private Room" | "Profile" | "Settings"
  >("Chats");
  const [roomId, setRoomId] = useState("");
  const [inputId, setInputId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
  if (activeTab === "Home") {
    navigate("/");
  }
}, [activeTab, navigate]);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full flex justify-between items-center bg-gray-800 text-white p-4 z-20">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setSidebarOpen(true)} className="text-2xl">
          &#9776;
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 space-y-6 transform transition-transform duration-300 z-30
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl">
            ✕
          </button>
        </div>

        <h2 className="text-2xl font-bold hidden md:block">Dashboard</h2>
        <nav className="space-y-3">
          {["Home","Chats", "Private Room", "Profile", "Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setSidebarOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
                activeTab === tab ? "bg-gray-700" : ""
              }`}
            >
              {tab === "Home" && "📨 Home"}
              {tab === "Chats" && "📨 Global Chat"}
              {tab === "Private Room" && "🔒 Private Room"}
              {tab === "Profile" && "👤 Profile"}
              {tab === "Settings" && "⚙️ Settings"}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 p-6 bg-gray-100 overflow-auto w-full">
        {activeTab === "Chats" && <Chat />}
        {activeTab === "Private Room" && (
          <>
            {!roomId && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className="p-2 border rounded w-full max-w-xs"
                />
                <button
                  className="p-2 text-white rounded bg-blue-600 hover:bg-blue-700 transition"
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
