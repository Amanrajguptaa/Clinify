"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

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
  patient: Patient;
}

interface Doctor {
  id: string;
  name: string;
  specialization?: string;
  appointments: Appointment[];
}

// Shimmer Skeleton for a single doctor table
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

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queue/all`, {
          withCredentials: true,
        });

        if (res.data.success) {
          // Map `specialization` to `specialty` for consistency with UI
          const normalizedDoctors = res.data.data.map((doc: any) => ({
            ...doc,
            specialty: doc.specialization || doc.specialty,
          }));
          setDoctors(normalizedDoctors);
        } else {
          throw new Error(res.data.message || "Failed to load queue");
        }
      } catch (err: any) {
        console.error("Axios error:", err);
        if (err.response) {
          setError(err.response.data?.message || "Server error");
        } else if (err.request) {
          setError("Network error – please check your connection");
        } else {
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

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
          <h1 className="text-3xl text-gray-900 sm:text-4xl font-light">Today's Doctor Queue</h1>
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
            <DoctorSkeleton />
          </>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🩺</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Appointments Today</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no scheduled patients for any doctor today.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{doctor.name}</h2>
                      {doctor.specialization && (
                        <p className="text-blue-100 mt-1 text-sm">{doctor.specialization}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {doctor.appointments.length} patient
                      {doctor.appointments.length !== 1 ? "s" : ""} waiting
                    </span>
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Age • Gender
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {doctor.appointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                                {appointment.queueNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {appointment.patient.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              <div className="flex items-center">
                                <PhoneIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {appointment.patient.phoneNumber}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              <div className="flex items-center">
                                <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                                {appointment.patient.age} • {appointment.patient.gender}
                              </div>
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

// Icons
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.74 21 4 15.26 4 8V5z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default DoctorsQueuePage;