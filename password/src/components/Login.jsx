import React, { useState } from "react";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5600";

const Login = ({ onAuthSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "Login failed");
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

      toast.success("Login successful 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-3xl font-bold text-green-600">Login</h2>

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

      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Login;