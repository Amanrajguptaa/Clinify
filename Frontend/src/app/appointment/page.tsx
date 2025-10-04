"use client";
import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DoctorCard from "../components/DoctorCard";
import AvailableDoctor from "../components/AvailableDoctor";

const dayOptions = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
];

const timeOptions = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

const AddDoctorPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    password: "",
    degree: "",
    experience: "",
    fee: "",
    about: "",
    availableDays: [] as string[],
    availableTimings: [null, null] as [Date | null, Date | null],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaysChange = (selected: any) => {
    const days = selected ? selected.map((s: any) => s.value) : [];
    setFormData((prev) => ({ ...prev, availableDays: days }));
  };

  const handleTimeChange = (dates: [Date | null, Date | null]) => {
    setFormData((prev) => ({ ...prev, availableTimings: dates }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Doctor Data:", formData);
    alert("Doctor added successfully ✅");
  };

  const inputClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all duration-200 outline-none";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="h-screen flex justify-center items-center w-full gap-10 bg-gray-50 overflow-hidden">
      <div className="hidden md:block pointer-events-none">
        <img src="/patient.png" alt="doctor" className="" />
      </div>
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-300 mx-4 md:mx-0">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add Patient Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Full Name*</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Dr. John Smith"
                    className={inputClasses}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Issue*</label>
                  <input
                    type="text"
                    name="specialization"
                    placeholder="Cardiologist"
                    className={inputClasses}
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Phone Number*</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 9876543210"
                    className={inputClasses}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}> Address*</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="doctor@example.com"
                    className={inputClasses}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Age*</label>
                  <input
                    type="text"
                    name="degree"
                    placeholder="MD, MBBS, etc."
                    className={inputClasses}
                    value={formData.degree}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Gender*</label>
                  <select
                    name="experience"
                    className={inputClasses}
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select experience</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>3 Years</option>
                    <option>4 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {step === 2 && (
                <>
                <div className="grid grid-cols-4 gap-5">
                  {[...Array(5)].map((_, index) => (
                    <AvailableDoctor
                      key={index}
                      name={`Demo ${index + 1}`}
                      specialization="MBBS"
                      fees={500}
                      image="https://res.cloudinary.com/dkqbawsqm/image/upload/v1744438993/kipaotl6qtavkxepxffd.png"
                      isAvailable={true}
                    />
                  ))}
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDoctorPage;
