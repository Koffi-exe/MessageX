import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    "Fast and responsive",
    "Easy to integrate",
    "Will add more features in future",
    "App is still under development",
  ];

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  return (
    <div>
      {!loggedUser._id ? (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-5xl font-bold mb-6">Welcome to MessageX</h1>
            <p className="text-lg mb-8">
              Send text messages without using traditional apps
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Features Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="bg-white shadow-md p-6 rounded-xl text-lg font-medium"
                >
                  ✅ {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (

        <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Banner */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome, {loggedUser.name || "User"}!</h2>
                <p className="text-gray-600">
                  You can now chat with friends and upload photos securely.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => alert('under development')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mr-3"
                >
                  Open Chat
                </button>
                <button
                  onClick={()=> alert('Under development')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Upload Photo
                </button>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">Recent Chats</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="p-3 bg-gray-100 rounded">👤 You chatted with Alice</li>
                  <li className="p-3 bg-gray-100 rounded">👤 You sent a photo to Bob</li>
                  <li className="p-3 bg-gray-100 rounded">👤 New friend request from Charlie</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">Uploaded Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-200 aspect-square rounded-md"></div>
                  <div className="bg-gray-300 aspect-square rounded-md"></div>
                  <div className="bg-gray-400 aspect-square rounded-md"></div>
                  {/* Replace above divs with actual <img src="..." /> later */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
