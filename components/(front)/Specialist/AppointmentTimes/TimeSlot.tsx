"use client";
import React from "react";

interface TimeSlotProps {
  time: string;
  isSelected?: boolean;
  isAvailable?: boolean;
  onClick?: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isSelected = false,
  isAvailable = true,
  onClick,
}) => {
  const baseClasses = "text-center p-2 border rounded cursor-pointer transition-colors w-full";
  
  const getClasses = () => {
    if (!isAvailable) {
      return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    if (isSelected) {
      return `${baseClasses} bg-blue-500 text-white border-blue-500`;
    }
    return `${baseClasses} border-gray-200 hover:bg-blue-50 hover:border-blue-300`;
  };

  return (
    <div
      className={getClasses()}
      onClick={isAvailable ? onClick : undefined}
    >
      {time}
    </div>
  );
};

export default TimeSlot; 