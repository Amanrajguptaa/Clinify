"use client";

import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react"; 
import { toast } from "react-toastify";

interface Props {
  doctor: { id: string; name: string };
  slot: string;
  onBack: () => void;
  onClose: () => void;
  date: Date;
  onSuccess?: () => void;
}

const PatientFormStep: React.FC<Props> = ({
  doctor,
  slot,
  onBack,
  onClose,
  date,
  onSuccess
}) => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Not Selected",
    visitType: "APPOINTMENT" as const,
    issue: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.age ||
      form.gender === "Not Selected"
    ) {
      toast.warn("Please fill in all required fields before proceeding.");
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduleDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/schedule`,
        {
          doctorId: doctor.id,
          slot,
          appointmentDate: scheduleDate,
          visitType: form.visitType,
          patientName: form.name,
          patientEmail: form.email,
          patientPhoneNumber: form.phone,
          patientIssue: form.issue,
          patientAddress: form.address,
          patientAge: form.age,
          patientGender: form.gender,
        },
        { withCredentials: true }
      );

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to schedule appointment", error);
      const errMsg =
        error.response?.data?.message ||
        "Failed to schedule appointment. Please try again later.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.age.trim() &&
    form.gender !== "Not Selected";

  return (
    <div className="space-y-5">
      {step === 1 ? (
        <>
          <div>
            <h2 className="text-xl font-bold text-blue-600">Patient Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Please provide the patient's basic information
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="e.g. 30"
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Gender
                </label>
                <select
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="Not Selected">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-blue-100">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                isStep1Valid
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-bold text-blue-600">Visit Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tell us more about the reason for the visit
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Visit Type
              </label>
              <select
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={form.visitType}
                onChange={(e) =>
                  setForm({ ...form, visitType: e.target.value as any })
                }
              >
                <option value="APPOINTMENT">Appointment</option>
                <option value="WALKIN">Walk-in</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Issue / Symptoms
              </label>
              <textarea
                placeholder="Describe the main concern or symptoms..."
                rows={3}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Address
              </label>
              <textarea
                placeholder="Patient's full address..."
                rows={2}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-blue-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-t-2 border-white rounded-full animate-spin"></span>
                  Scheduling...
                </>
              ) : (
                "Confirm Appointment"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientFormStep;
