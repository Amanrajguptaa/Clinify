// app/page.tsx
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
  specialty?: string;
  appointments: Appointment[];
}

const DoctorsQueuePage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        // Axios request with credentials (cookies sent automatically)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queue/all`,{withCredentials:true}); // Adjust route as needed

        // Assuming your Express-like API returns { success, data, message }
        if (res.data.success) {
          setDoctors(res.data.data || []);
        } else {
          throw new Error(res.data.message || "Failed to load queue");
        }
      } catch (err: any) {
        console.error("Axios error:", err);
        if (err.response) {
          // Server responded with error status
          setError(err.response.data?.message || "Server error");
        } else if (err.request) {
          // Network error (no response)
          setError("Network error – please check your connection");
        } else {
          // Other errors
          setError(err.message || "An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  // ... (rest of UI remains the same)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading today's queue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🩺</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Appointments Today</h1>
          <p className="text-gray-600">
            There are no scheduled patients for any doctor today.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
                {doctor.specialty && (
                  <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
                )}
                <div className="mt-3 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {doctor.appointments.length} patient
                    {doctor.appointments.length !== 1 ? "s" : ""} waiting
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {doctor.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-sm">
                          {appointment.queueNumber}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900">
                          {appointment.patient.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <PhoneIcon className="mr-1 h-4 w-4" />
                            {appointment.patient.phoneNumber}
                          </span>
                          <span className="flex items-center">
                            <UserIcon className="mr-1 h-4 w-4" />
                            {appointment.patient.age} • {appointment.patient.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Icons (same as before)
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