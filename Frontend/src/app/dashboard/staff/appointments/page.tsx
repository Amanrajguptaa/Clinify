"use client";

import React, { useState, useEffect } from "react";
import CalendarPicker from "@/components/CalendarPicker";
import { Search, Plus, Clock, Calendar as CalendarIcon } from "lucide-react";
import AddAppointmentModal from "@/components/AddAppointmentModal";
import AppointmentCard from "@/components/AppointmentCard";
import EditAppointmentModal from "@/components/EditAppointmentModal";
import RescheduleAppointmentModal from "@/components/RescheduleAppointmentModal";
import { Appointment } from "@/components/AppointmentCard";
import axios from "axios";

const AppointmentSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm animate-pulse h-56">
    <div className="flex justify-between items-start mb-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2 mt-4">
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
  const [reschedulingAppointment, setReschedulingAppointment] =
    useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/all-appointments`,
          {
            params: {
              date:
                date.getFullYear() +
                "-" +
                String(date.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(date.getDate()).padStart(2, "0"),
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setAppointments(response.data.data || []);
        } else {
          setAppointments([]);
        }
      } catch (error) {
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

  const handleSaveEdit = async (updatedData: Partial<Appointment>) => {
    if (!editingAppointment) return;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/edit/${editingAppointment.id}`,
        updatedData,
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
    } catch (error) {
      alert("Failed to update appointment. Please try again.");
    }
  };

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT COLUMN: Calendar & Controls */}
          <div className="lg:col-span-2 space-y-3">
            {/* Date Header */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Schedule</h2>
              </div>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>

            {/* Add Appointment Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Appointment
            </button>

            {/* Calendar */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-300">
              <CalendarPicker selected={date} onSelect={setDate} />
            </div>
          </div>

          {/* RIGHT COLUMN: Appointments List */}
          <div className="lg:col-span-3 space-y-3">
            {/* Search Bar */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor or patient name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Appointments Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <AppointmentSkeleton key={i} />
                ))}
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAppointments.map((appt) => (
                  <div key={appt.id} className="animate-fadeIn">
                    <AppointmentCard
                      data={appt}
                      onEdit={(id) => {
                        const apt = appointments.find((a) => a.id === id);
                        if (apt) setEditingAppointment(apt);
                      }}
                      onReschedule={(id) => {
                        const apt = appointments.find((a) => a.id === id);
                        if (apt) setReschedulingAppointment(apt);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-300 shadow-sm">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-4">
                  <Clock className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No appointments scheduled
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  There are no appointments for{" "}
                  <span className="font-medium">{formattedDate}</span>.
                  <br />
                  Click{" "}
                  <span className="text-blue-600 font-medium">
                    “Add Appointment”
                  </span>{" "}
                  to schedule one!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <AddAppointmentModal onClose={() => setShowModal(false)} date={date} />
      )}

      {editingAppointment && (
        <EditAppointmentModal
          isOpen={true}
          onClose={() => setEditingAppointment(null)}
          appointment={editingAppointment}
          onSave={handleSaveEdit}
        />
      )}

      {reschedulingAppointment && (
        <RescheduleAppointmentModal
          isOpen={true}
          onClose={() => setReschedulingAppointment(null)}
          onSuccess={() => {}}
          appointment={reschedulingAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
