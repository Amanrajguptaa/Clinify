
"use client";

import React from "react";
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
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  data,
  onEdit,
  onDelete,
  onReschedule,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (paymentStatus: string) => {
    return paymentStatus === "PAID"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header with Doctor Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{data.doctor.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Stethoscope className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-600">{data.doctor.specialization}</span>
            </div>
            <p className="text-sm font-medium text-gray-700 mt-1">
              ₹{data.doctor.fees}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(data.status)}`}>
              {data.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 ${getPaymentColor(data.paymentStatus)}`}>
              {data.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Patient & Appointment Details */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-800">{data.patient.name}</span>
          <span className="text-xs text-gray-500">
            {data.patient.age} • {data.patient.gender}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
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
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-700">Issue:</span>{" "}
            <span className="text-gray-600">{data.patient.issue}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex justify-between">
        <button
          onClick={() => onEdit?.(data.id)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Edit</span>
        </button>

        <button
          onClick={() => onReschedule?.(data.id)}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
          title="Reschedule"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reschedule</span>
        </button>

        <button
          onClick={() => onDelete?.(data.id)}
          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;