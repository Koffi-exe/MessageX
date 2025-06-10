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
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterForm>(initialFormState);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${apiUrl}/register/user`, formData);
      setSuccess(true);
      setFormData(initialFormState);
      console.log(response.data);
      const{saveduser, token} =response.data
      const{_id, name}= saveduser
      localStorage.setItem('loggedUser', JSON.stringify({_id, name, token}))
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.response.data.message)
      return
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {success && (
          <p className="text-green-600 text-sm">Registered successfully!</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
