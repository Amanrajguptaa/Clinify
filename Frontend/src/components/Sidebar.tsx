"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, UserCheck, UserPlus, Stethoscope } from "lucide-react";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/staff/stats",
      label: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      href: "/dashboard/staff/appointments",
      label: "Appointments",
      icon: <Calendar size={20} />,
    },
    {
      href: "/dashboard/staff/doctor",
      label: " Doctors",
      icon: <Stethoscope size={20} />,
    },
    {
      href: "/dashboard/staff/queue",
      label: "Queue",
      icon: <UserCheck size={20} />,
    },
  ];

  return (
    <div
      className="w-56 h-full py-8 pt-24 px-4 bg-white border-r border-gray-200 fixed shadow-sm"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                 flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm
                transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                }
              `}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="px-3 py-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-gray-800">System Status</p>
          </div>
          <p className="text-xs text-gray-600">All systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
