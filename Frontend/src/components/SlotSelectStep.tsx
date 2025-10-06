"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

interface Props {
  doctor: { id: string; name: string };
  onNext: (slot: string) => void;
  onBack: () => void;
  date: Date;
}

// ====== SHIMMER SKELETON FOR SLOT GRID ======
const SlotSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-10 bg-gray-200 rounded-md animate-pulse"
        ></div>
      ))}
    </div>
  );
};

// helper: convert "9:00AM-1:00PM" → ["9:00AM - 9:30AM", "9:30AM - 10:00AM", ...]
function generateHalfHourSlots(range: string): string[] {
  const [startStr, endStr] = range.split("-");

  const parseTime = (timeStr: string): Date => {
    const date = new Date();
    const [time, meridiem] = timeStr.match(/(\d+:\d+)(AM|PM)/i)!.slice(1);
    let [hours, minutes] = time.split(":").map(Number);

    if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")}${meridiem}`;
  };

  const start = parseTime(startStr);
  const end = parseTime(endStr);
  const slots: string[] = [];

  while (start < end) {
    const next = new Date(start.getTime() + 30 * 60000); // +30 mins
    if (next > end) break;
    slots.push(`${formatTime(start)} - ${formatTime(next)}`);
    start.setTime(next.getTime());
  }

  return slots;
}

const SlotSelectStep: React.FC<Props> = ({ doctor, onNext, onBack, date }) => {
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/slots/${doctor.id}`,
          {
            params: { date: date.toISOString() },
            withCredentials: true,
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          const expandedSlots = response.data.data.flatMap((range: string) =>
            generateHalfHourSlots(range)
          );
          setSlots(expandedSlots);
        } else {
          setSlots([]);
        }
      } catch (error) {
        console.error("Error fetching doctor slots:", error);
        setSlots([]);
      } finally {
        setLoading(false); // Stop loading regardless of success/error
      }
    };

    fetchSlots();
  }, [doctor.id, date]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Select Available Slot for{" "}
        <span className="text-blue-600">{doctor.name}</span>
      </h2>

      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <SlotSkeleton />
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot) => (
              <div
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`text-center py-2.5 rounded-md cursor-pointer border transition-colors duration-200 ${
                  selectedSlot === slot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                {slot}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-8 text-center">
            No slots available for this date.
          </p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          disabled={!selectedSlot || loading}
          onClick={() => onNext(selectedSlot!)}
          className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
            !selectedSlot || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default SlotSelectStep;