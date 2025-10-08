import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const metadata: Metadata = {
  title: "Clinify",
  description: "A Clinic Front Desk Management Application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <div className="ml-56 flex-1 mt-16">{children}</div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
