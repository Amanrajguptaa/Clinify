"use client";

import DoctorCard from "@/components/DoctorCard";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, ArrowLeft, ArrowRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  fees: number;
  isAvailable: boolean;
  image: string;
  phoneNumber: string;
  degree: string;
  experience: number;
  about: string;
  gender?: string;
  schedule: Record<string, string[]>;
  user?: {
    email: string;
  };
}

const Page = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slotPattern =
    /^([0-9]{1,2}:[0-5][0-9](AM|PM))-([0-9]{1,2}:[0-5][0-9](AM|PM))$/;

  const [schedule, setSchedule] = useState<Record<string, string[]>>({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  });

  const [formData, setFormData] = useState({
    image: null as File | null,
    name: "",
    specialty: "",
    email: "",
    password: "",
    degree: "",
    experience: "",
    fees: "",
    about: "",
    phoneNumber: "",
    gender: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch doctors with loading state
  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/all-doctors`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (err: unknown) {
      console.error("Error fetching doctors:", err);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "available"
        ? doctor.isAvailable
        : !doctor.isAvailable;

    return matchesSearch && matchesFilter;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addDoctor = async () => {
    console.log("🚨 addDoctor CALLED at step:", step);
    console.trace(); // Shows call stack
    if (!formData.image && !editingDoctor) {
      return toast.error("Image not selected");
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber
    ) {
      return toast.error("Please fill all required fields");
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      if (formData.image) fd.append("image", formData.image);
      fd.append("schedule", JSON.stringify(schedule));
      fd.append("name", formData.name);
      fd.append("specialization", formData.specialty);
      fd.append("email", formData.email);
      fd.append("password", formData.password);
      fd.append("degree", formData.degree);
      fd.append("experience", formData.experience);
      fd.append("fees", formData.fees);
      fd.append("about", formData.about);
      fd.append("phoneNumber", formData.phoneNumber);
      fd.append("gender", formData.gender.toUpperCase());

      let response;

      response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/add`,
        fd,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        setStep(1);
        setEditingDoctor(null);
        setFormData({
          image: null,
          name: "",
          specialty: "",
          email: "",
          password: "",
          degree: "",
          experience: "",
          fees: "",
          about: "",
          phoneNumber: "",
          gender: "",
        });
        setPreviewUrl(null);
        setSchedule({
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
          SATURDAY: [],
          SUNDAY: [],
        });
        fetchDoctors(); // Refresh data
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Error submitting doctor:", error);
      toast.error("Error submitting doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editDoctor = async (id: string) => {
    console.log("🚨 editDoctor CALLED!");
    if (!formData.image && !editingDoctor) {
      return toast.error("Image not selected");
    }

    if (!formData.name || !formData.email || !formData.phoneNumber) {
      return toast.error("Please fill all required fields");
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      if (formData.image) fd.append("image", formData.image);
      fd.append("schedule", JSON.stringify(schedule));
      fd.append("name", formData.name);
      fd.append("specialization", formData.specialty);
      fd.append("email", formData.email);
      if (formData.password) fd.append("password", formData.password);
      fd.append("degree", formData.degree);
      fd.append("experience", formData.experience);
      fd.append("fees", formData.fees);
      fd.append("about", formData.about);
      fd.append("phoneNumber", formData.phoneNumber);
      fd.append("gender", formData.gender.toUpperCase());

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/edit/${id}`,
        fd,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        setStep(1);
        setEditingDoctor(null);
        setIsEditing(false);
        setFormData({
          image: null,
          name: "",
          specialty: "",
          email: "",
          password: "",
          degree: "",
          experience: "",
          fees: "",
          about: "",
          phoneNumber: "",
          gender: "",
        });
        setPreviewUrl(null);
        setSchedule({
          MONDAY: [],
          TUESDAY: [],
          WEDNESDAY: [],
          THURSDAY: [],
          FRIDAY: [],
          SATURDAY: [],
          SUNDAY: [],
        });
        fetchDoctors(); // Refresh data
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Error editing doctor:", error);
      toast.error("Error editing doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10 digits";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!editingDoctor && !formData.password.trim())
      newErrors.password = "Password is required";

    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.specialty.trim())
      newErrors.specialty = "Specialization is required";

    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!formData.fees.trim()) newErrors.fees = "Consultation fees required";

    if (!formData.about.trim()) newErrors.about = "About is required";

    // Validate schedule slots
    Object.entries(schedule).forEach(([day, slots]) => {
      slots.forEach((slot, idx) => {
        if (!slotPattern.test(slot)) {
          newErrors[`schedule-${day}-${idx}`] =
            "Invalid slot format, e.g., 9:00AM-12:00PM";
        }
      });
    });

    if (!formData.image && !editingDoctor)
      newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🟢 handleSubmit called at step:", step);
    e.preventDefault();

    if (step !== 3) {
      console.warn("🛑 handleSubmit blocked: Not on final step");
      return;
    }

    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    if (editingDoctor) {
      await editDoctor(editingDoctor.id);
    } else {
      await addDoctor();
    }
  };

  // Reset form when closing modal
  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
    setEditingDoctor(null);
    setIsEditing(false);
    setErrors({});
    setFormData({
      image: null,
      name: "",
      specialty: "",
      email: "",
      password: "",
      degree: "",
      experience: "",
      fees: "",
      about: "",
      phoneNumber: "",
      gender: "",
    });
    setPreviewUrl(null);
    setSchedule({
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    });
  };
  // Replace your existing renderSkeletons function with this:
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="border rounded-xl p-4 space-y-3">
        {/* Image placeholder */}
        <div className="h-48 w-full rounded-lg shimmer"></div>

        {/* Title */}
        <div className="h-6 w-3/4 rounded shimmer"></div>

        {/* Specialization */}
        <div className="h-4 w-full rounded shimmer"></div>

        {/* Fees & availability */}
        <div className="h-4 w-2/3 rounded shimmer"></div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded shimmer"></div>
          <div className="h-8 w-20 rounded shimmer"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-start">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border text-black border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm min-w-[180px]"
            >
              <option value="all">All Doctors</option>
              <option value="available">Available</option>
              <option value="notAvailable">Not Available</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setShowModal(true);
                setStep(1);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Plus size={20} /> Add Doctor
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSkeletons()}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                specialization={doctor.specialization}
                fees={doctor.fees}
                isAvailable={doctor.isAvailable}
                image={doctor.image}
                onEdit={() => {
                  if (!doctor) return;
                  setIsEditing(true);
                  setEditingDoctor(doctor);
                  setFormData({
                    image: null,
                    name: doctor.name || "",
                    specialty: doctor.specialization || "",
                    email: doctor.user?.email || "",
                    password: "",
                    degree: doctor.degree || "",
                    experience: doctor.experience?.toString() || "",
                    fees: doctor.fees?.toString() || "",
                    about: doctor.about || "",
                    phoneNumber: doctor.phoneNumber || "",
                    gender: doctor.gender || "",
                  });

                  setPreviewUrl(doctor.image || null);

                  setSchedule({
                    MONDAY: doctor.schedule?.MONDAY || [],
                    TUESDAY: doctor.schedule?.TUESDAY || [],
                    WEDNESDAY: doctor.schedule?.WEDNESDAY || [],
                    THURSDAY: doctor.schedule?.THURSDAY || [],
                    FRIDAY: doctor.schedule?.FRIDAY || [],
                    SATURDAY: doctor.schedule?.SATURDAY || [],
                    SUNDAY: doctor.schedule?.SUNDAY || [],
                  });

                  setStep(1);
                  setShowModal(true);
                }}
                onDeleteSuccess={fetchDoctors}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Avatar-style illustration */}
            <div className="relative mb-5">
              <div className="bg-gradient-to-br from-blue-50 to-blue-50 border-2 border-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                <svg
                  className="text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-sm">
                <Plus className="text-white" size={14} />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {search || filter !== "all"
                ? "No doctors found"
                : "No doctors yet"}
            </h3>
            <p className="text-gray-600 max-w-md leading-relaxed">
              {search || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Add your first doctor to get started"}
            </p>

            {!search && filter === "all" && (
              <button
                type="button"
                onClick={() => {
                  setShowModal(true);
                  setEditingDoctor(null);
                  setStep(1);
                }}
                className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus size={18} /> Add Doctor
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                className="bg-white w-full max-w-4xl rounded-lg shadow-xl relative max-h-[90vh] overflow-hidden border-2 border-blue-200"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Blue Header Accent */}
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-1px)] px-8 py-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>

                  <h2 className="text-2xl font-bold mb-2 text-blue-600 tracking-tight">
                    {editingDoctor ? `Edit Doctor Profile` : `Add New Doctor`}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {step === 1 && "Basic Information"}
                    {step === 2 && "Contact & Professional Details"}
                    {step === 3 && "Schedule & Availability"}
                  </p>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                        step >= 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`h-0.5 w-12 transition-colors ${
                        step >= 2 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                        step >= 2
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      2
                    </div>
                    <div
                      className={`h-0.5 w-12 transition-colors ${
                        step >= 3 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                        step >= 3
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      3
                    </div>
                  </div>

                  <div className="space-y-6">
                    {step === 1 && (
                      <div className="space-y-5">
                        {/* Profile Image Section */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-blue-100">
                          <label className="block text-sm font-bold text-gray-800 mb-3">
                            Profile Image
                          </label>
                          <div className="flex flex-col md:flex-row items-center gap-5">
                            <div className="relative">
                              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                    <div className="bg-white/80 p-3 rounded-full">
                                      <Plus
                                        className="text-gray-400"
                                        size={24}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                <label
                                  htmlFor="avatar-upload"
                                  className="cursor-pointer"
                                >
                                  <Plus size={14} className="text-white" />
                                  <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800 mb-1">
                                Upload Profile Photo
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                JPG, PNG, or GIF (max 5MB)
                              </p>
                              <label
                                htmlFor="avatar-upload-fallback"
                                className="inline-block px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors font-medium border border-gray-200"
                              >
                                Choose File
                              </label>
                              <input
                                id="avatar-upload-fallback"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                              {errors.image && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                  {errors.image}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Full Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter full name"
                              className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                                errors.name
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                            />
                            {errors.name && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              placeholder="Enter phone number"
                              className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                                errors.phoneNumber
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phoneNumber: e.target.value,
                                })
                              }
                            />
                            {errors.phoneNumber && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.phoneNumber}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Gender
                            </label>
                            <select
                              className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                                errors.gender
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              value={formData.gender}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  gender: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Gender</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                            </select>
                            {errors.gender && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.gender}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Specialization
                            </label>
                            <select
                              className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                                errors.specialty
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              value={formData.specialty}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  specialty: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Specialization</option>
                              <option>General Physician</option>
                              <option>Cardiologist</option>
                              <option>Dermatologist</option>
                              <option>Pediatrician</option>
                              <option>Gynecologist</option>
                            </select>
                            {errors.specialty && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.specialty}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Degree
                            </label>
                            <input
                              type="text"
                              placeholder="Enter degree"
                              className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                                errors.degree
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              value={formData.degree}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  degree: e.target.value,
                                })
                              }
                            />
                            {errors.degree && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.degree}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Experience
                            </label>
                            <select
                              className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                                errors.experience
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                              value={formData.experience}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  experience: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Experience</option>
                              <option>1 Year</option>
                              <option>2 Years</option>
                              <option>3 Years</option>
                              <option>5+ Years</option>
                            </select>
                            {errors.experience && (
                              <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.experience}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Consultation Fees (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="Enter fees"
                            className={`w-full border text-black px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                              errors.fees ? "border-red-500" : "border-gray-200"
                            }`}
                            value={formData.fees}
                            onChange={(e) =>
                              setFormData({ ...formData, fees: e.target.value })
                            }
                          />
                          {errors.fees && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {errors.fees}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="doctor@clinic.com"
                            className={`w-full border text-black px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Password{" "}
                            {editingDoctor && "(Leave blank to keep current)"}
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                          {errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            About Doctor
                          </label>
                          <textarea
                            placeholder="Brief description about the doctor..."
                            className={`w-full text-black border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm min-h-[100px] ${
                              errors.about
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                            value={formData.about}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                about: e.target.value,
                              })
                            }
                          />
                          {errors.about && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                              {errors.about}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.keys(schedule).map((day) => (
                            <div
                              key={day}
                              className="border-2 border-blue-100 rounded-lg p-4 bg-slate-50"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-sm text-gray-800">
                                  {day}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSchedule({
                                      ...schedule,
                                      [day]: [...schedule[day], ""],
                                    })
                                  }
                                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-xs cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                >
                                  <Plus size={14} /> Add Slot
                                </button>
                              </div>

                              {schedule[day].map((slot, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    placeholder="9:00AM-12:00PM"
                                    className={`flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm  text-black transition-all ${
                                      errors[`schedule-${day}-${index}`]
                                        ? "border-red-500"
                                        : "border-gray-200"
                                    }`}
                                    value={slot}
                                    onChange={(e) => {
                                      const newSlots = [...schedule[day]];
                                      newSlots[index] = e.target.value;
                                      setSchedule({
                                        ...schedule,
                                        [day]: newSlots,
                                      });
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSlots = [...schedule[day]];
                                      newSlots.splice(index, 1);
                                      setSchedule({
                                        ...schedule,
                                        [day]: newSlots,
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}

                              {schedule[day].length === 0 && (
                                <p className="text-gray-400 text-xs italic">
                                  No slots added
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4 border-t border-blue-100 mt-6">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all cursor-pointer text-sm"
                        >
                          <ArrowLeft size={18} /> Back
                        </button>
                      )}

                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={() => {
                            let isValid = true;
                            const newErrors: Record<string, string> = {
                              ...errors,
                            };

                            if (step === 1) {
                              if (!formData.name.trim()) {
                                newErrors.name = "Full name is required";
                                isValid = false;
                              }
                              if (
                                !formData.phoneNumber.trim() ||
                                !/^\d{10}$/.test(formData.phoneNumber)
                              ) {
                                newErrors.phoneNumber =
                                  !formData.phoneNumber.trim()
                                    ? "Phone number is required"
                                    : "Phone number must be 10 digits";
                                isValid = false;
                              }
                              if (!formData.gender.trim()) {
                                newErrors.gender = "Gender is required";
                                isValid = false;
                              }
                              if (!formData.specialty.trim()) {
                                newErrors.specialty =
                                  "Specialization is required";
                                isValid = false;
                              }
                              if (!formData.degree.trim()) {
                                newErrors.degree = "Degree is required";
                                isValid = false;
                              }
                              if (!formData.experience.trim()) {
                                newErrors.experience = "Experience is required";
                                isValid = false;
                              }
                              if (!formData.image && !editingDoctor) {
                                newErrors.image = "Profile image is required";
                                isValid = false;
                              }
                            } else if (step === 2) {
                              if (!formData.fees.trim()) {
                                newErrors.fees = "Consultation fees required";
                                isValid = false;
                              }
                              if (
                                !formData.email.trim() ||
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                  formData.email
                                )
                              ) {
                                newErrors.email = !formData.email.trim()
                                  ? "Email is required"
                                  : "Invalid email address";
                                isValid = false;
                              }
                              if (!editingDoctor && !formData.password.trim()) {
                                newErrors.password = "Password is required";
                                isValid = false;
                              }
                              if (!formData.about.trim()) {
                                newErrors.about = "About is required";
                                isValid = false;
                              }
                            }

                            setErrors(newErrors);

                            if (isValid) {
                              setStep(step + 1);
                            }
                          }}
                          className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-semibold cursor-pointer text-sm active:scale-95"
                        >
                          Next <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e as unknown as React.FormEvent);
                          }}
                          disabled={isSubmitting}
                          className={`ml-auto px-5 py-2.5 rounded-lg font-semibold transition-all text-sm cursor-pointer ${
                            isSubmitting
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 border-t-2 border-white rounded-full animate-spin"></span>
                              Processing...
                            </span>
                          ) : editingDoctor ? (
                            "Update Doctor"
                          ) : (
                            "Add Doctor"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
