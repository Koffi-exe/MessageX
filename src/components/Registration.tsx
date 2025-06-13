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
  const [OtpValidationError, setOtpValidationError] = useState<string>("");
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
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, max 6 characters
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
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
      // console.log("This is otp response", response);
      setRegisterStatus(response.data.message);
      console.log(response.data);
      if (response.status == 200) {
        setShowOtpInput(true);
      }
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setTimeout(() => {
        setError("");
        setRegisterStatus("");
      }, 5000);
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register/verify-otp`, {
        otp,
        email: formData.email,
      });
      console.log("This is response", response)
      console.log("This is response.data", response.data)
      const { saveduser, token } = response.data;
      console.log("This is savedUser ", saveduser)
      console.log("This is token: ", token)
      const { _id, name } = saveduser;
      console.log("This is _id and name, ", _id, name)
      localStorage.setItem("loggedUser", JSON.stringify({ _id, name, token }));
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error.response)
      setOtpValidationError(error.response?.data.message);
    } finally {
      setTimeout(() => setOtpValidationError(""), 5000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSendOtp} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
        />
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Username"
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {registerStatus && (
          <p className="text-green-600 text-sm">{registerStatus}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {showOtpInput && (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={handleOtpInput}
              className="w-full p-2 border rounded text-center tracking-widest text-lg"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            {OtpValidationError && (
              <p className="text-red-500 text-sm">{OtpValidationError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Verify OTP
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
