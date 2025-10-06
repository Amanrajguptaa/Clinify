"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const StaffLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        const role = response.data.role.toLowerCase();
        router.push(`/dashboard/${role}`);
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (err: unknown) {
      console.error("Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3AAFB9]/70 via-blue-50 to-blue-100 relative overflow-hidden">
      <div className="absolute left-6 top-16 rotate-16 pointer-events-none ">
        <Image src="/syringe.png" alt="Syringe" width={350} height={300} />
      </div>
      <div className="absolute right-10 bottom-16 -rotate-20 pointer-events-none">
        <Image
          src="/stethoscope.png"
          alt="Stethoscope"
          width={300}
          height={300}
        />
      </div>

      <div className="backdrop-blur-xl bg-white/70 shadow-2xl rounded-2xl px-10 py-16 w-full max-w-md relative z-10 border border-white/40">
        <div className="flex justify-center mb-4">
          <h1 className="text-5xl text-[#3AAFB9] font-semibold">Clinify</h1>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Welcome back! Please login to continue.
        </p>

        <form onSubmit={(e) => handleLogin(e)}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 bg-white/60 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3AAFB9]/50 focus:border-[#3AAFB9]/50 outline-none transition text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 bg-white/60 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3AAFB9]/50 focus:border-[#3AAFB9]/50 outline-none transition text-black"
          />

          <button
            type="submit"
            className="w-full bg-[#3AAFB9] cursor-pointer text-white py-3 rounded-lg shadow-lg font-semibold hover:scale-[1.03] hover:shadow-2xl transition-transform"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
