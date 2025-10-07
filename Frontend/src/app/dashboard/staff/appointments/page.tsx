"use client";

import React, { useState, useEffect } from "react";
import CalendarPicker from "@/components/CalendarPicker";
import { Search, Calendar, Plus, Clock, User } from "lucide-react";
import AddAppointmentModal from "@/components/AddAppointmentModal";
import AppointmentCard from "@/components/AppointmentCard";
import EditAppointmentModal from "@/components/EditAppointmentModal";
import { Appointment } from "@/components/AppointmentCard";
import axios from "axios";

// ====== SHIMMER SKELETON ======
const AppointmentSkeleton = () => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-pulse h-60">
    <div className="flex justify-between items-start mb-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="flex items-center gap-2 mt-3">
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const AppointmentPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/all-appointments`,
          {
            params: { date: date.toISOString().split("T")[0] }, // Only date part
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setAppointments(response.data.data || []);
        } else {
          setAppointments([]);
        }
      } catch (error: unknown) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [date]);

  const filteredAppointments = appointments.filter((a) => {
    const doctorName = a.doctor?.name || "";
    const patientName = a.patient?.name || "";
    const searchTerm = search.toLowerCase();
    return (
      doctorName.toLowerCase().includes(searchTerm) ||
      patientName.toLowerCase().includes(searchTerm)
    );
  });

const handleSaveEdit = async (updatedData: any) => {
  if (!editingAppointment) return;

  // If the payload contains a nested `patient` object, flatten it
  let payload = updatedData;

  if (updatedData.patient) {
    payload = {
      patientName: updatedData.patient.name,
      patientEmail: updatedData.patient.email,
      patientPhoneNumber: updatedData.patient.phoneNumber,
      patientIssue: updatedData.patient.issue,
      patientAddress: updatedData.patient.address,
      patientAge: updatedData.patient.age,
      patientGender: updatedData.patient.gender,
      // Add other top-level appointment fields if needed later (e.g., slot, status)
    };
  }

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/edit/${editingAppointment.id}`,
      payload, // ← now flat!
      { withCredentials: true }
    );

    if (response.data.appointment) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === editingAppointment.id
            ? { ...appt, ...response.data.appointment }
            : appt
        )
      );
      setEditingAppointment(null);
    }
  } catch (error: unknown) {
    console.error("Edit error:", error);
    alert("Failed to update appointment. Please try again.");
  }
};

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Date Picker Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          Select Date
        </h2>
        <div className="flex justify-between items-center w-full">
        <div className="w-full">
          <CalendarPicker selected={date} onSelect={setDate} />
        </div>
        <img src="/doctor_banner.png" alt="doctor" className="w-96 h-auto" />
        </div>
      </div>


      {/* Search & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex items-center w-full sm:w-1/3">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor or patient..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Appointment
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          // ====== LOADING SKELETONS ======
          Array.from({ length: 3 }).map((_, i) => (
            <AppointmentSkeleton key={i} />
          ))
        ) : filteredAppointments.length > 0 ? (
          // ====== APPOINTMENT CARDS ======
          filteredAppointments.map((appt) => (
            <div key={appt.id} className="animate-fadeIn">
              <AppointmentCard
                data={appt}
                onEdit={(id) => {
                  const apt = appointments.find((a) => a.id === id);
                  if (apt) setEditingAppointment(apt);
                }}
              />
            </div>
          ))
        ) : (
          // ====== EMPTY STATE ======
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are no appointments for <span className="font-semibold">{date.toDateString()}</span>.
              Click <span className="font-medium text-blue-600">“Add Appointment”</span> to schedule one!
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          date={date}
        />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          isOpen={true}
          onClose={() => setEditingAppointment(null)}
          appointment={editingAppointment}
          onSave={handleSaveEdit}
        />
      )}


    </div>
  );
};

export default AppointmentPage;