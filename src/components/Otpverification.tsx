import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OtpVerificationProps {
  email: string;
}

export default function OtpVerification({ email }: OtpVerificationProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, max 6 characters
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/verify-otp`, {
        email,
        otp,
      });
      const { savedUser, token } = response.data;
      const { _id, name } = savedUser;
      localStorage.setItem("loggedUser", JSON.stringify({ _id, name, token }));
      setSuccess(true);
      setError("");
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <></>
  );
}
