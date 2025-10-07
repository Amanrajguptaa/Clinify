import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface DoctorCardProps {
  id: string;
  name: string;
  specialization: string;
  fees: number;
  isAvailable: boolean;
  image: string;
  onEdit?: () => void;
  onDeleteSuccess?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  specialization,
  fees,
  isAvailable,
  image,
  onEdit,
  onDeleteSuccess,
}) => {
  const [available, setAvailable] = useState(isAvailable);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false); // New state for toggle loading

  const toggleAvailability = async () => {
    if (isToggling) return;
    setIsToggling(true);
    const newStatus = !available;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/availability/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setAvailable(newStatus); // Update UI only on success
        toast.success(`Doctor is now ${newStatus ? "available" : "unavailable"}`);
      } else {
        toast.error(response.data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Toggle availability error:", error);
      toast.error("Error updating availability");
      // Revert optimistic update if you had one, but here we only update on success
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Doctor deleted successfully");
        onDeleteSuccess?.();
      } else {
        toast.error(response.data.message || "Failed to delete doctor");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting doctor");
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <div className="w-42 md:w-80 bg-white rounded-lg overflow-hidden flex flex-col items-center border border-blue-400 relative shadow-md">
        <img
          src={image}
          alt={name}
          className="w-full h-32 md:h-64 object-cover bg-slate-50 pointer-events-none"
        />

        <div className="w-full bg-white p-4 flex flex-col items-start">
          <div className="flex items-center justify-between w-full mb-2">
            <h3 className="text-sm font-bold text-blue-600 tracking-tight">
              {specialization}
            </h3>
            <div className="flex gap-2">
              <div
                className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
              >
                <Edit
                  size={16}
                  className="text-gray-600 group-hover:text-blue-600 transition-colors"
                />
              </div>
              <div
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmModal(true);
                }}
              >
                <Trash2
                  size={16}
                  className="text-gray-600 group-hover:text-red-600 transition-colors"
                />
              </div>
            </div>
          </div>

          <p className="text-xs font-semibold text-gray-800">{name}</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Fees: ₹{fees}</p>

          <div className="mt-3 flex items-center justify-between w-full pt-3 border-t border-gray-200">
            <span
              className={`text-xs font-semibold ${
                available ? "text-green-600" : "text-red-600"
              }`}
            >
              {available ? "Available" : "Not Available"}
            </span>

            <div
              onClick={toggleAvailability}
              className={`relative inline-flex h-5 w-10 items-center rounded-full cursor-pointer transition-all shadow-sm ${
                available ? "bg-green-500" : "bg-gray-400"
              } ${isToggling ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  available ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmModal(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 ${
                  isDeleting ? "opacity-80 cursor-not-allowed" : ""
                }`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorCard;