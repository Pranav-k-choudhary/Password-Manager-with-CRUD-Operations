import React, { useState } from "react";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5600";

const Register = ({ onAuthSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Registration failed");
        return;
      }

      if (!data?.user) {
        toast.error("Invalid server response");
        return;
      }

      onAuthSuccess({
        token: data.token,
        email: data.user.email,
        userId: data.user.userId,
      });

      toast.success("Account created successfully 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-3xl font-bold text-green-600">Register</h2>

      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
        className="border px-4 py-2 rounded w-72"
      />

      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="border px-4 py-2 rounded w-72"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={credentials.confirmPassword}
        onChange={(e) =>
          setCredentials({ ...credentials, confirmPassword: e.target.value })
        }
        className="border px-4 py-2 rounded w-72"
      />

      <button
        onClick={handleRegister}
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        Create Account
      </button>
    </div>
  );
};

export default Register;