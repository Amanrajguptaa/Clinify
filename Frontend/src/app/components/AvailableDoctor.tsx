import React, { useState } from "react";

interface AvailableDoctorProps {
  name: string;
  specialization: string;
  fees: number;
  isAvailable: boolean;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AvailableDoctor: React.FC<AvailableDoctorProps> = ({
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
    <div className="w-42 md:w-40 bg-white rounded-2xl overflow-hidden shadow-md flex flex-col items-center border border-gray-400 relative">
      <img
        src={image}
        alt={name}
        className="w-full h-32 md:h-32 object-contain bg-blue-100 pointer-events-none"
      />

      <div className="w-full bg-white p-3 flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-sm font-semibold text-gray-800">
            {specialization}
          </h3>
          <div className="flex gap-2">
           
          </div>
        </div>

        <p className="text-xs text-gray-800">{name}</p>
        <p className="text-xs text-gray-800 mt-1">Fees: ₹{fees}</p>

       
      </div>
    </div>
  );
};

export default AvailableDoctor;
