"use client";

import React, { useState } from "react";
import { X } from "lucide-react"; // Make sure you have lucide-react installed
import DoctorSelectStep from "./DoctorSelectStep";
import SlotSelectStep from "./SlotSelectStep";
import PatientFormStep from "./PatientFormStep";

interface Props {
  onClose: () => void;
  date: Date;
}

const AddAppointmentModal: React.FC<Props> = ({ onClose, date }) => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl relative max-h-[90vh] overflow-hidden border-2 border-blue-200">
        {/* Blue Top Accent Bar */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto max-h-[calc(90vh-1px)] px-6 py-5">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>

          {/* Modal Title */}
          <h2 className="text-xl font-bold text-blue-600 mb-1">
            Book an Appointment
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {step === 1 && "Select a doctor"}
            {step === 2 && "Choose an available time slot"}
            {step === 3 && "Enter patient details"}
          </p>

          {/* Progress Indicator - 3 Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`h-0.5 w-10 transition-colors ${
                step >= 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`h-0.5 w-10 transition-colors ${
                step >= 3 ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>

          {/* Step Content */}
          <div className="space-y-5">
            {step === 1 && (
              <DoctorSelectStep
                date={date}
                onNext={(doc) => {
                  setSelectedDoctor(doc);
                  setStep(2);
                }}
                onCancel={onClose}
              />
            )}

            {step === 2 && selectedDoctor && (
              <SlotSelectStep
                date={date}
                doctor={selectedDoctor}
                onNext={(slot) => {
                  setSelectedSlot(slot);
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && selectedSlot && (
              <PatientFormStep
                date={date}
                doctor={selectedDoctor}
                slot={selectedSlot}
                onBack={() => setStep(2)}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
