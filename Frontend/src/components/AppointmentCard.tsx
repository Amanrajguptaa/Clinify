"use client";

import React from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";

export interface Appointment {
  id: string;
  doctor: {
    id:string
    name: string;
    specialization: string;
    fees: number;
  };
  patient: {
    name: string;
    phoneNumber: string;
    age: number;
    gender: string;
    issue: string;
    email?: string;
    address?: string;
  };
  slot: string;
  appointmentDate: string;
  visitType: string;
  status: string;
  paymentStatus: string;
}

interface AppointmentCardProps {
  data: Appointment;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onStatusChange?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  data,
  onEdit,
  onDelete,
  onReschedule,
  onStatusChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (paymentStatus: string) => {
    return paymentStatus === "PAID"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const handleStatusUpdate = async (newStatus: "COMPLETED" | "CANCELLED") => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/status/${data.id}`,
        { status: newStatus },
        {
          withCredentials: true, // sends cookies (for auth)
        }
      );

      if (response.status === 200) {
        onStatusChange?.();
        console.log("Status updated successfully");
      }
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-400 overflow-hidden duration-300">
      {/* Header with Doctor Info */}
      <div className="bg-blue-600/70 p-4">
        <div className="flex flex-col items-start justify-center">
          <div>
            <h3 className="font-bold text-lg text-white">{data.doctor.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-white">
              <Stethoscope className="w-4 h-4 text-blue-200" />
              <span className="text-sm">{data.doctor.specialization}</span>
            </div>
            <p className="text-sm font-medium text-white mt-1">
              ₹{data.doctor.fees}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                data.status
              )}`}
            >
              {data.status}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                data.paymentStatus
              )}`}
            >
              {data.paymentStatus}
            </span>

            {/* Mark Complete Button */}
            {data.status !== "COMPLETED" && data.status !== "CANCELLED" && (
              <button
                onClick={() => handleStatusUpdate("COMPLETED")}
                className="cursor-pointer text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-full text-xs transition-colors"
              >
                Mark Complete
              </button>
            )}

          
          </div>
        </div>
      </div>

      {/* Patient & Appointment Details */}
      <div className="p-4 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-800">{data.patient.name}</span>
          <span className="text-xs text-gray-500">
            {data.patient.age} • {data.patient.gender}
          </span>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(data.appointmentDate).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {data.slot} • {data.visitType}
          </div>
          <div className="mt-4 p-2 bg-gray-50 rounded-sm border border-gray-200">
            <span className="font-medium text-gray-700">Issue:</span>{" "}
            <span className="text-gray-600">{data.patient.issue}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex justify-between text-xs">
        <button
          onClick={() => onEdit?.(data.id)}
          className="cursor-pointer flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onReschedule?.(data.id)}
          className="cursor-pointer flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
          title="Reschedule"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reschedule</span>
        </button>

        
        <button
                          onClick={() => handleStatusUpdate("CANCELLED")}

          className="cursor-pointer flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
          <span>Cancel</span>
        </button>
       
      </div>
    </div>
  );
};

export default AppointmentCard;