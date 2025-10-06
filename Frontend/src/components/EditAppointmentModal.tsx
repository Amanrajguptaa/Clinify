"use client";

import React, { useState } from "react";
import { Appointment } from "./AppointmentCard";
import { X } from "lucide-react";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSave: (updatedData: Partial<Appointment>) => Promise<void>;
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  setError(null);

  try {
    await onSave({
      patient: {
        name: formData.patientName,
        email: formData.patientEmail || undefined,
        phoneNumber: formData.patientPhoneNumber,
        issue: formData.patientIssue,
        address: formData.patientAddress || undefined,
        age: parseInt(formData.patientAge) || 0,
        gender: formData.patientGender, 
      },
    });
    onClose();
  } catch (err: any) {
    setError(err?.message || "Failed to update patient details");
  } finally {
    setIsSaving(false);
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Patient Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <h3 className="font-semibold text-gray-800">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="patientName"
              placeholder="Name"
              value={formData.patientName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
            <input
              type="email"
              name="patientEmail"
              placeholder="Email"
              value={formData.patientEmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              type="tel"
              name="patientPhoneNumber"
              placeholder="Phone Number"
              value={formData.patientPhoneNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
            <input
              type="number"
              name="patientAge"
              placeholder="Age"
              value={formData.patientAge}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              min="0"
            />
            <select
              name="patientGender"
              value={formData.patientGender}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              type="text"
              name="patientAddress"
              placeholder="Address"
              value={formData.patientAddress}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <textarea
            name="patientIssue"
            placeholder="Patient Issue"
            value={formData.patientIssue}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;