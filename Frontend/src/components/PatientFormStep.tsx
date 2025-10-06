"use client";

import React, { useState } from "react";
import axios from "axios";

interface Props {
  doctor: { id: string; name: string };
  slot: string;
  onBack: () => void;
  onClose: () => void;
  date: Date;
}

const PatientFormStep: React.FC<Props> = ({
  doctor,
  slot,
  onBack,
  onClose,
  date,
}) => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "Not Selected",
    visitType: "APPOINTMENT",
    issue: "",
    address: "",
  });


const handleSubmit = async () => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/appointment/schedule`,
      {
        doctorId: doctor.id,
        slot,
        appointmentDate: date,
        visitType: form.visitType,
        patientName: form.name,
        patientEmail: form.email,
        patientPhoneNumber: form.phone,
        patientIssue: form.issue,
        patientAddress: form.address,
        patientAge: form.age,
        patientGender: form.gender,
      },{withCredentials:true}
    );
    onClose();
  } catch (error: unknown) {
    console.error("Failed to schedule appointment");
  }
};



  return (
    <div className="space-y-4">
      {step === 1 ? (
        <>
          <h2 className="text-lg font-semibold">Patient Details</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-md p-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-md p-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border rounded-md p-2"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full border rounded-md p-2"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <select
              className="w-full border rounded-md p-2"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="Not Selected">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-between pt-3">
            <button onClick={onBack}>Back</button>
            <button
              disabled={!form.name || !form.email || !form.phone || !form.age}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Visit Details</h2>
          <div className="space-y-3">
            <select
              className="w-full border rounded-md p-2"
              value={form.visitType}
              onChange={(e) => setForm({ ...form, visitType: e.target.value })}
            >
              <option value="APPOINTMENT">Appointment</option>
              <option value="WALKIN">Walkin</option>

              <option value="EMERGENCY">Emergency</option>
            </select>
            <textarea
              placeholder="Issue / Symptoms"
              className="w-full border rounded-md p-2"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
            />
            <textarea
              placeholder="Address"
              className="w-full border rounded-md p-2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="flex justify-between pt-3">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={handleSubmit}>Confirm</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientFormStep;
