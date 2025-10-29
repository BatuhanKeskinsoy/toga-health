"use client";
import CustomButton from "@/components/Customs/CustomButton";
import React from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

interface WeekNavigatorProps {
  currentMonth: string;
  currentYear: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentMonth,
  currentYear,
  onPreviousWeek,
  onNextWeek,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-lg font-medium">
        {currentMonth} {currentYear}
      </span>
      <div className="flex gap-2">
        <CustomButton
          leftIcon={<IoArrowBack />}
          handleClick={onPreviousWeek}
          containerStyles="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
          isDisabled={!canGoPrevious}
        />
        <CustomButton
          rightIcon={<IoArrowForward />}
          handleClick={onNextWeek}
          containerStyles="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
          isDisabled={!canGoNext}
        />
      </div>
    </div>
  );
};

export default WeekNavigator; 