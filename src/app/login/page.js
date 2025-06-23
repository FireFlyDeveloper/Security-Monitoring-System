'use client';

import React, { useState } from 'react';
import '../globals.css';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const response = await fetch("/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        const error = await response.json();
        alert("Login failed: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#121212] text-[#e0e0e0] font-sans">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="bg-[#1e1e1e] rounded-lg shadow-[0_8px_32px_rgba(0,150,255,0.1)] border border-[rgba(48,67,82,0.5)]">
          <div className="bg-gradient-to-br from-[#1a2a3a] to-[#121820] rounded-t-lg p-6 text-center">
            <div className="inline-block p-4 mb-3 rounded-full animate-pulse bg-[rgba(0,132,255,0.1)]">
              <i className="fas fa-shield-alt text-[#0084ff] text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-1">Security Monitoring System</h1>
            <p className="text-gray-400 text-sm">Secure Access Portal</p>
          </div>

          <div className="p-6">
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  <i className="fas fa-user mr-2 text-gray-400"></i>Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#3a3a3a] text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  <i className="fas fa-lock mr-2 text-gray-400"></i>Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full px-3 py-2 rounded bg-[#2a2a2a] border border-[#3a3a3a] text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-400"
                    onClick={togglePassword}
                  >
                    <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-md text-white font-medium flex justify-center items-center bg-gradient-to-br from-[#0061a7] to-[#003b6f] hover:from-[#0077cf] hover:to-[#004d8c] transition-all hover:-translate-y-0.5"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>© 2025 Security Monitoring System. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 132, 255, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(0, 132, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 132, 255, 0); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};
