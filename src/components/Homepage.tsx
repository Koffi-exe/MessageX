// HomePage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    "Fast and responsive",
    "Easy to integrate",
    "Will add more features in future"
  ];

  useEffect(()=>{
    alert('The application is under development')
  },[])

  return (
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
  );
};

export default HomePage;
