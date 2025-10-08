"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";

type StatData = {
  totalAppointments: number;
  currentQueue: number;
  availableDoctors: number;
};

type ChartItem = {
  name: string;
  value: number;
  color: string;
};

type SnapshotData = {
  totalAppointments: number;
  walkIns: number;
  avgWaitTime: string;
  availableDoctors: number;
  urgentCases: number;
  patientsServed: number;
};

const Dashboard = () => {
  const [stats, setStats] = useState<StatData>({
    totalAppointments: 0,
    currentQueue: 0,
    availableDoctors: 0,
  });

  const [appointmentStatusData, setAppointmentStatusData] = useState<ChartItem[]>([]);
  const [queueStatusData, setQueueStatusData] = useState<ChartItem[]>([]);
  const [snapshotData, setSnapshotData] = useState<SnapshotData>({
    totalAppointments: 0,
    walkIns: 0,
    avgWaitTime: "0 mins",
    availableDoctors: 0,
    urgentCases: 0,
    patientsServed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/stats`,
        { withCredentials: true }
      );

      const data = res.data;
      setStats(data.stats);
      setAppointmentStatusData(data.appointmentStatusData);
      setQueueStatusData(data.queueStatusData);
      setSnapshotData(data.snapshotData);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <>
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ShimmerChart />
              <ShimmerChart />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

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
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ShimmerSnapshot />
                <ShimmerSnapshot />
                <ShimmerSnapshot />
                <ShimmerSnapshot />
                <ShimmerSnapshot />
                <ShimmerSnapshot />
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">{icon}</div>
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
      className={`p-2 rounded-lg ${highlight ? "bg-red-100" : "bg-blue-100"}`}
    >
      <Icon
        className={`w-5 h-5 ${highlight ? "text-red-600" : "text-blue-600"}`}
      />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p
        className={`font-medium ${highlight ? "text-red-700" : "text-gray-800"}`}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  </div>
);

const ShimmerCard = () => (
  <div className="bg-white shadow-sm rounded-lg border border-gray-300 p-5 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="p-3 bg-gray-200 rounded-lg w-10 h-10"></div>
    </div>
  </div>
);

const ShimmerChart = () => (
  <div className="bg-white shadow-sm rounded-lg border border-gray-300 p-5 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const ShimmerSnapshot = () => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-300 animate-pulse">
    <div className="p-2 bg-gray-200 rounded-lg w-8 h-8"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export default Dashboard;