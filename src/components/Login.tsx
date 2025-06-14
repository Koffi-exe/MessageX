import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const initialFormState: LoginForm = {
  email: "",
  password: "",
};

export default function Login() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginForm>(initialFormState);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email format.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/login`, formData);
      console.log(response.data);
      const { user, token } = response.data;
      const {_id, name, username, email} = user
      // console.log(`This is extracted data, _id:${_id}, token:${token}, name: ${name}, username: ${username}`)
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({ name, _id, token, username, email })
      );

      setSuccess(true);
      setFormData(initialFormState);
      navigate("/dashboard");
    } catch (e: any) {
      if (e?.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError("Internal server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
          autoComplete="current-password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">Logged in successfully!</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
