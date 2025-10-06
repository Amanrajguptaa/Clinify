"use client";

import React, { useState } from "react";
import DoctorSelectStep from "./DoctorSelectStep";
import SlotSelectStep from "./SlotSelectStep";
import PatientFormStep from "./PatientFormStep";
interface Props {
  onClose: () => void;
  date:Date
}

const AddAppointmentModal: React.FC<Props> = ({ onClose,date }) => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 space-y-4">
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
  );
};

export default AddAppointmentModal;
