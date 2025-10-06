"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

interface Props {
  selected: Date;
  onSelect: (date: Date) => void;
}

const CalendarPicker: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white w-full">
      <h2 className="text-lg font-semibold mb-2">Pick a Date *</h2>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        className="!text-gray-800 w-full flex justify-center items-center"
        styles={{
          caption: { textAlign: "center", fontWeight: "900", width:"100%" },
          head_cell: { color: "#6b7280" },
          day_selected: {
            backgroundColor: "#3b82f6",
            color: "white",
            borderRadius: "8px",
          },
          day_today: {
            backgroundColor: "#dbeafe",
            borderRadius: "8px",
          },
        }}
      />
      <p className="text-sm text-gray-500 mt-2 flex justify-center items-center">
        Selected: {format(selected, "PPP")}
      </p>
    </div>
  );
};

export default CalendarPicker;
