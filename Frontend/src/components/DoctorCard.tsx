import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

interface DoctorCardProps {
  name: string;
  specialization: string;
  fees: number;
  isAvailable: boolean;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialization,
  fees,
  isAvailable,
  image,
  onEdit,
  onDelete,
}) => {
  const [available, setAvailable] = useState(isAvailable);

  const toggleAvailability = () => {
    setAvailable(!available);
  };

  return (
    <div className="w-42 md:w-64 bg-white rounded-2xl overflow-hidden shadow-md flex flex-col items-center border border-gray-400 relative">
      <img
        src={image}
        alt={name}
        className="w-full h-32 md:h-48 object-cover bg-blue-100 pointer-events-none"
      />

      <div className="w-full bg-white p-3 flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold text-gray-800">
            {specialization}
          </h3>
          <div className="flex gap-2">
            <Edit
              size={16}
              className="text-gray-600 cursor-pointer hover:text-blue-500"
              onClick={onEdit}
            />
            <Trash2
              size={16}
              className="text-gray-600 cursor-pointer hover:text-red-500"
              onClick={onDelete}
            />
          </div>
        </div>

        <p className="text-xs text-gray-800">{name}</p>
        <p className="text-xs text-gray-800 mt-1">Fees: ₹{fees}</p>

        <div className="mt-2 flex items-center justify-between w-full">
          <span className="text-xs font-medium text-gray-600">
            {available ? "Available" : "Not Available"}
          </span>

          <div
            onClick={toggleAvailability}
            className={`relative inline-flex h-5 w-10 items-center rounded-full cursor-pointer transition-colors ${
              available ? "bg-green-500" : "bg-red-400"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                available ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
