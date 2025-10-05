"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, UserCheck, UserPlus,Wallet } from "lucide-react";

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
      label: "Add Doctor",
      icon: <UserPlus size={20} />,
    },
    {
      href: "/dashboard/staff/queue",
      label: "Queue",
      icon: <UserCheck size={20} />,
    },
    {
      href: "/dashboard/staff/payment",
      label: "Payments",
      icon: <Wallet size={20} />,
    },
  ];

  return (
    <div className="w-56 h-full py-32 px-4 bg-gray-50 z-10 border-r-2 fixed">
      <div className="flex flex-col gap-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 p-2 rounded hover:bg-primary/70
                ${isActive ? "bg-[#3AAFB9] text-white" : "text-gray-700"}
              `}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
