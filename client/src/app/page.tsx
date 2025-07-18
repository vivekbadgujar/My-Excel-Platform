"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", loginData);
      const data = response.data as { token: string; email: string; role: string; userId: string };
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("role", data.role || "");
      localStorage.setItem("userId", data.userId || "Not available");
      setError(null);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError("Login failed: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">My Excel Platform</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 space-y-4">
          <h2 className="text-xl font-semibold">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
            <p className="text-center text-gray-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}