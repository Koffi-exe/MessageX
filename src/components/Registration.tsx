import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  name: string;
  email: string;
  username: string;
  password: string;
}

const initialFormState: RegisterForm = {
  name: "",
  email: "",
  username: "",
  password: "",
};

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>(initialFormState);
  const [error, setError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [registerStatus, setRegisterStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const { name, email, username, password } = formData;
    if (!name || !email || !username || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowOtpInput(false);
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/register/send-otp`,
        formData
      );
      setRegisterStatus("OTP has been sent to your email.");
      if (response.status === 200) setShowOtpInput(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setTimeout(() => {
        setError("");
        setRegisterStatus("");
      }, 5000);
      setLoading(false);
    }
  };

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) setOtp(value);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register/verify-otp`, {
        otp,
        email: formData.email,
      });
      const expiresAt = Date.now() + 7*24*60*60*1000;
      const { saveduser, token } = response.data;
      const { _id, name, username, email } = saveduser;
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({ _id, name, token, username, email, expiresAt })
      );
      navigate("/");
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setTimeout(() => setOtpError(""), 5000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create an Account
      </h2>

      <form onSubmit={handleSendOtp} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email Address"
        />
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Choose a Username"
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Create a Password"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {registerStatus && (
          <p className="text-green-600 text-sm">{registerStatus}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      {showOtpInput && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-center mb-4">
            Verify Your Email
          </h3>
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={handleOtpInput}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 border border-gray-300 rounded text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {otpError && (
              <p className="text-red-600 text-sm text-center">{otpError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
              Verify & Register
            </button>
          </form>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          className="text-blue-600 hover:underline font-medium"
          onClick={() => navigate("/login")}
        >
          Log in here
        </button>
      </p>
    </div>
  );
}
