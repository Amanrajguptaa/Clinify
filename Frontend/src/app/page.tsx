"use client";

import React, { useState } from "react";
import Image from "next/image";

const StaffLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-50 to-purple-100 relative overflow-hidden">
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
          <h1 className="text-5xl text-blue-500/70 font-semibold">Clinify</h1>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-2">
          Staff Login
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Welcome back! Please login to continue.
        </p>

        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-white/60 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-white/60 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-black"
        />

        <button className="w-full bg-blue-500 cursor-pointer text-white py-3 rounded-lg shadow-lg font-semibold hover:scale-[1.03] hover:shadow-2xl transition-transform">
          Login
        </button>
      </div>
    </div>
  );
};

export default StaffLogin;
