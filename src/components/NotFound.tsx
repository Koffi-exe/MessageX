import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
