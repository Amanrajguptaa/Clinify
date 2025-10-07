"use client";

import React from "react";
import { User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();

  const logoutHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        { withCredentials: true }
      );

      if (response.data.success) {
        router.push("/");
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (err: unknown) {
      console.error("Login error");
    }
  };

  return (
    <div
      className="shadow-sm border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-20"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with Icon */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div className="font-bold text-2xl text-blue-600 tracking-tight">
              Clinify
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-gray-200 hover:bg-slate-100 transition-colors cursor-default">
              <User className="text-gray-600" size={18} />
              <span className="text-gray-700 text-sm font-medium">Staff</span>
            </div>
            <button
              onClick={(e) => logoutHandler(e)}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
