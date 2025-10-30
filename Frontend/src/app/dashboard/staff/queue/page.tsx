"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  age: number;
  gender: string;
}

interface Appointment {
  id: string;
  queueNumber: number;
  slot: string;
  visitType: string;
  status: string;
  paymentStatus: string;
  patient: Patient;
}

interface Doctor {
  id: string;
  name: string;
  specialization?: string;
  appointments: Appointment[];
}

const DoctorSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 animate-pulse">
    <div className="p-5 border-b border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="mt-3 h-6 w-32 bg-gray-200 rounded-full"></div>
    </div>
    <div className="divide-y divide-gray-100">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-3">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DoctorsQueuePage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQueueNumber, setNewQueueNumber] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queue/all`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setDoctors(res.data.data);
        } else {
          throw new Error(res.data.message || "Failed to load queue");
        }
      } catch (err: any) {
        console.error("Axios error:", err);
        if (err.response) {
          toast.error(err.response.data?.message || "Server error");
          setError(err.response.data?.message || "Server error");
        } else if (err.request) {
          toast.error("Network error – please check your connection");
          setError("Network error – please check your connection");
        } else {
          toast.error(err.message || "An unexpected error occurred");
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const handleQueueUpdate = async (appointmentId: string) => {
    if (newQueueNumber === null) return;
    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queue/update/${appointmentId}`,
        { queueNumber: newQueueNumber },
        { withCredentials: true }
      );

      if (res.data.success) {
        setDoctors((prev) =>
          prev.map((doc) => ({
            ...doc,
            appointments: doc.appointments.map((appt) =>
              appt.id === appointmentId
                ? { ...appt, queueNumber: newQueueNumber }
                : appt
            ),
          }))
        );
        setEditingId(null);
        setNewQueueNumber(null);
        toast.success(res.data.message || "Queue number updated successfully");
      } else {
        toast.warn(res.data.message || "Failed to update queue number");
      }
    } catch (err: any) {
      console.error("Queue update error:", err);
      if (err.response) {
        toast.error(
          err.response.data?.message || "Server error while updating queue"
        );
      } else if (err.request) {
        toast.error("Network error – please check your connection");
      } else {
        toast.error(err.message || "An unexpected error occurred");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center border border-red-100">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10">
          <h1 className="text-3xl text-gray-900 sm:text-4xl font-light">
            Today's Doctor Queue
          </h1>
          <p className="mt-2 text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {loading ? (
          <>
            <DoctorSkeleton />
            <DoctorSkeleton />
          </>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🩺</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Appointments Today
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no scheduled patients for any doctor today.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{doctor.name}</h2>
                      {doctor.specialization && (
                        <p className="text-blue-100 mt-1 text-sm">
                          {doctor.specialization}
                        </p>
                      )}
                    </div>
                    {(() => {
                      const activeAppointments = doctor.appointments.filter(
                        (appt) =>
                          appt.status !== "COMPLETED" &&
                          appt.status !== "CANCELLED"
                      );
                      const activeCount = activeAppointments.length;

                      return (
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          {activeCount} patient{activeCount !== 1 ? "s" : ""}{" "}
                          waiting
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {doctor.appointments.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 italic">
                    No patients in queue
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Queue #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Age/Gender
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Visit Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {doctor.appointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-700">
                              {editingId === appointment.id ? (
                                <input
                                  type="number"
                                  value={
                                    newQueueNumber ?? appointment.queueNumber
                                  }
                                  onChange={(e) =>
                                    setNewQueueNumber(Number(e.target.value))
                                  }
                                  className="w-16 border rounded px-2 py-1 text-sm"
                                />
                              ) : (
                                appointment.queueNumber
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {appointment.patient.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {appointment.patient.age}/{appointment.patient.gender}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {appointment.visitType}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                appointment.status === "COMPLETED"
                                  ? "text-green-600"
                                  : appointment.status === "CANCELLED"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {appointment.status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {editingId === appointment.id ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      handleQueueUpdate(appointment.id)
                                    }
                                    disabled={updating}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                  >
                                    {updating ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                appointment.status !== "COMPLETED" &&
                                appointment.status !== "CANCELLED" && (
                                  <button
                                    onClick={() => {
                                      setEditingId(appointment.id);
                                      setNewQueueNumber(
                                        appointment.queueNumber
                                      );
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsQueuePage;
