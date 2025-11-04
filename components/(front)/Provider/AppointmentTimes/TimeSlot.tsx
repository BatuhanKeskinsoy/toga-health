"use client";
import React from "react";

interface TimeSlotProps {
  time: string;
  isSelected?: boolean;
  isAvailable?: boolean;
  isBooked?: boolean;
  onClick?: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isSelected = false,
  isAvailable = true,
  isBooked = false,
  onClick,
}) => {
  const baseClasses =
    "flex items-center justify-center text-center text-xs font-medium h-7 rounded-md transition-all w-full";

  const getClasses = () => {
    if (isBooked) {
      return `${baseClasses} bg-gray-200 border border-dashed border-gray-400 text-gray-600 cursor-not-allowed opacity-40`;
    }
    if (!isAvailable) {
      return `${baseClasses} bg-gray-100 border border-dashed border-gray-300 text-gray-500 cursor-not-allowed opacity-50`;
    }
    if (isSelected) {
      return `${baseClasses} bg-sitePrimary border border-sitePrimary text-white cursor-pointer`;
    }
    return `${baseClasses} text-sitePrimary border bg-sitePrimary/10 hover:bg-sitePrimary border-sitePrimary/10 hover:text-white cursor-pointer`;
  };

  const isClickable = isAvailable && !isBooked;

  const handleClick = (e: React.MouseEvent) => {
    if (!isClickable) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.();
  };

  return (
    <div
      className={getClasses()}
      onClick={handleClick}
    >
      {time}
    </div>
  );
};

export default TimeSlot;
