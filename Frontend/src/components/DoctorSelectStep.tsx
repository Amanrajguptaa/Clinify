"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Props {
  onNext: (doctor: Doctor) => void;
  onCancel: () => void;
  date: Date;
}

// ====== SHIMMER SKELETON FOR DOCTOR LIST ======
const DoctorSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-3 border border-gray-200 rounded-lg bg-white animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

const DoctorSelectStep: React.FC<Props> = ({ onNext, onCancel, date }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/available`,
          {
            params: {
  date: date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0')
},withCredentials:true
          }
        );

        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          setDoctors([]);
        }
      } catch (error: unknown) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false); // Stop loading regardless of success/error
      }
    };

    fetchDoctors();
  }, [date]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Doctor *</h2>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <DoctorSkeleton />
        ) : doctors.length > 0 ? (
          doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedDoctor === doc.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.specialization}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No doctors available on this date.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={!selectedDoctor || loading}
          onClick={() =>
            onNext(doctors.find((d) => d.id === selectedDoctor) as Doctor)
          }
          className={`px-4 py-2 font-medium rounded-lg transition-colors ${
            !selectedDoctor || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default DoctorSelectStep;