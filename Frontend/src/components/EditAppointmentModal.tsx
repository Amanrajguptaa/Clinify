"use client";

import React, { useState } from "react";
import { Appointment } from "./AppointmentCard";
import { X } from "lucide-react";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSave: (updatedData: Partial<EditAppointmentApiPayload>) => Promise<void>;
}

interface EditAppointmentApiPayload {
  patientName?: string;
  patientEmail?: string;
  patientPhoneNumber?: string;
  patientIssue?: string;
  patientAddress?: string;
  patientAge?: number;
  patientGender?: string;

  slot?: string;
  appointmentDate?: string;
  visitType?: string;
  status?: string;
  paymentStatus?: string;
}
const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    patientName: appointment.patient.name,
    patientEmail: appointment.patient.email || "",
    patientPhoneNumber: appointment.patient.phoneNumber,
    patientIssue: appointment.patient.issue,
    patientAddress: appointment.patient.address || "",
    patientAge: appointment.patient.age.toString(),
    patientGender: appointment.patient.gender,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Flatten the patient data into root-level fields
      const updatedData = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail || undefined,
        patientPhoneNumber: formData.patientPhoneNumber,
        patientIssue: formData.patientIssue,
        patientAddress: formData.patientAddress || undefined,
        patientAge: parseInt(formData.patientAge) || 0,
        patientGender: formData.patientGender,
        // Add other appointment fields here if needed later (e.g., slot, status)
      };

      await onSave(updatedData);
      onClose();
    } catch (err: unknown) {
      setError("Failed to update patient details");
    } finally {
      setIsSaving(false);
    }
  };
  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl relative max-h-[90vh] overflow-hidden border-2 border-blue-200">
        {/* Blue Top Accent */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

        <div className="overflow-y-auto max-h-[calc(90vh-1px)]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-600">
              Edit Patient Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 px-3 py-2.5 rounded-lg text-sm font-medium border border-red-200">
                {error}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="patientPhoneNumber"
                    value={formData.patientPhoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    required
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    min="0"
                    max="120"
                    value={formData.patientAge}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    name="patientAddress"
                    value={formData.patientAddress}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Issue */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Issue / Symptoms
              </label>
              <textarea
                name="patientIssue"
                value={formData.patientIssue}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                  isSaving
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                }`}
              >
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 border-t-2 border-white rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
