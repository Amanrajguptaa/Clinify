"use client";

import React from "react";
import {
  Calendar,
  Users,
  Clock,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const stats = {
  totalAppointments: 14,
  currentQueue: 5,
  availableDoctors: 3,
};

// Updated to use blue-based colors
const appointmentStatusData = [
  { name: "Booked", value: 10, color: "#3b82f6" },     // blue-500
  { name: "Canceled", value: 2, color: "#ef4444" },    // red-500 (keep for cancellation)
  { name: "Rescheduled", value: 2, color: "#60a5fa" }, // blue-400
];

const queueStatusData = [
  { name: "Waiting", value: 3, color: "#60a5fa" },     // blue-400
  { name: "With Doctor", value: 2, color: "#2563eb" }, // blue-600
  { name: "Completed", value: 9, color: "#93c5fd" },   // blue-300
];

const snapshotData = {
  totalAppointments: 14,
  walkIns: 5,
  avgWaitTime: "18 mins",
  availableDoctors: 3,
  urgentCases: 2,
  patientsServed: 9,
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white shadow-sm rounded-lg border border-gray-300 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
      </div>
      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
        {icon}
      </div>
    </div>
  </div>
);

const SnapshotMetric = ({
  icon: Icon,
  label,
  value,
  subtext,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-300 tracking-tighter">
    <div
      className={`p-2 rounded-lg ${
        highlight ? "bg-red-100" : "bg-blue-100"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${highlight ? "text-red-600" : "text-blue-600"}`}
      />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`font-medium ${
          highlight ? "text-red-700" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50 font-light tracking-tighter text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-medium text-gray-800 mb-2">
            Clinic <span className="font-light">Dashboard</span>
          </h2>
          <p className="text-gray-600">
            Real-time overview of today’s operations
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Appointments Today"
            value={stats.totalAppointments}
            icon={<Calendar className="w-6 h-6" />}
          />
          <StatCard
            title="In Queue"
            value={stats.currentQueue}
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Available Doctors"
            value={stats.availableDoctors}
            icon={<Stethoscope className="w-6 h-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg border border-gray-300 p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Appointment Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-300 p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Queue Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={queueStatusData}
                    cx="50%"
                    cy="50%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {queueStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Today's Snapshot */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-300 overflow-hidden">
          <div className="p-5 border-b border-gray-300">
            <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Today’s Clinic Snapshot
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Real-time overview of operations as of now
            </p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SnapshotMetric
                icon={Users}
                label="Total Appointments"
                value={snapshotData.totalAppointments}
                subtext="Includes walk-ins"
              />
              <SnapshotMetric
                icon={Clock}
                label="Avg. Wait Time"
                value={snapshotData.avgWaitTime}
                subtext="From check-in to doctor"
              />
              <SnapshotMetric
                icon={Stethoscope}
                label="Available Doctors"
                value={snapshotData.availableDoctors}
                subtext="Ready for new patients"
              />
              <SnapshotMetric
                icon={TrendingUp}
                label="Patients Served"
                value={snapshotData.patientsServed}
                subtext="Marked as completed"
              />
              <SnapshotMetric
                icon={Users}
                label="Walk-ins Added"
                value={snapshotData.walkIns}
                subtext="Non-appointment patients"
              />
              <SnapshotMetric
                icon={AlertTriangle}
                label="Urgent Cases"
                value={snapshotData.urgentCases}
                subtext="Priority queue"
                highlight={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;