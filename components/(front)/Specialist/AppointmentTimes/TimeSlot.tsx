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
  const baseClasses = "text-center text-sm p-2 bg-gray-100 border rounded-md cursor-pointer transition-all duration-300 w-full opacity-80";
  
  const getClasses = () => {
    if (!isAvailable) {
      return `${baseClasses} bg-gray-100 border-dashed border-gray-300 text-gray-500 cursor-not-allowed opacity-50`;
    }
    if (isSelected) {
      return `${baseClasses} bg-sitePrimary border-sitePrimary text-white`;
    }
    return `${baseClasses} text-sitePrimary bg-sitePrimary/10 hover:bg-sitePrimary border-sitePrimary/10 hover:text-white`;
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