"use client";

import React, { useContext } from "react";
import { User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();

  const logoutHandler = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="shadow-sm border-b-2 bg-white fixed top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="font-bold text-3xl text-[#3AAFB9]">Clinify</div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <User className="text-gray-600" size={24} />
              <span className="text-gray-700">Staff</span>
            </div>
            <button
              onClick={(e) => logoutHandler(e)}
              className="bg-[#3AAFB9] text-black px-6 py-2 rounded-3xl transition-all cursor-pointer"
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
