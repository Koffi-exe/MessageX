import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedElementProps {
  children: React.ReactNode;
}

export default function ProtectedElement({ children }: ProtectedElementProps) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const verifyToken = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
      const token = loggedUser.token;

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.post(
          `${apiUrl}/jwt/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const validity = response.data.valid;
        if (validity) {
          setIsValid(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    verifyToken();
  }, [apiUrl, navigate]);

  if (isValid === null) {
    return <p className="text-center mt-4">Checking authentication...</p>;
  }

  return <>{children}</>;
}
