"use client";
import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        <img src="/doctor.png" alt="doctor" className="scale-125" />
      </div>
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-300 mx-4 md:mx-0">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md bg-gray-100 flex items-center justify-center relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Doctor preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Upload Doctor Profile Picture
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    Professional photo recommended
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="picture"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="picture"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg border border-blue-200 hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                  >
                    Choose image
                  </label>
                </div>
              </div>

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
                  <label className={labelClasses}>Specialization*</label>
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
                  <label className={labelClasses}>Email Address*</label>
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
                  <label className={labelClasses}>Degree*</label>
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
                  <label className={labelClasses}>Experience*</label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Consultation Fee (₹)*</label>
                  <input
                    type="number"
                    name="fee"
                    placeholder="Enter consultation fee"
                    className={inputClasses}
                    value={formData.fee}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className={labelClasses}>Available Days*</label>
                  <Select
                    options={dayOptions}
                    isMulti
                    onChange={handleDaysChange}
                    value={dayOptions.filter((day) =>
                      formData.availableDays.includes(day.value)
                    )}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select available days"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Start Time*</label>
                  <select name="startTime" className={inputClasses} required>
                    <option value="">Select start time</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>End Time*</label>
                  <select name="endTime" className={inputClasses} required>
                    <option value="">Select end time</option>
                    {timeOptions
                      .filter((time) => {
                        const startIndex = timeOptions.indexOf("");
                        return (
                          startIndex === -1 ||
                          timeOptions.indexOf(time) > startIndex
                        );
                      })
                      .map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>About*</label>
                <textarea
                  name="about"
                  placeholder="Provide a brief description..."
                  className={`${inputClasses} h-40 resize-y`}
                  value={formData.about}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                >
                  Submit Doctor
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDoctorPage;
