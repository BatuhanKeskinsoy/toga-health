"use client";
import CustomButton from "@/components/others/CustomButton";
import React from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

interface WeekNavigatorProps {
  currentMonth: string;
  currentYear: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  canGoPrevious: boolean;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentMonth,
  currentYear,
  onPreviousWeek,
  onNextWeek,
  canGoPrevious,
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
          containerStyles="h-10 w-10"
          isDisabled={!canGoPrevious}
        />
        <CustomButton
          rightIcon={<IoArrowForward />}
          handleClick={onNextWeek}
          containerStyles="h-10 w-10"
        />
      </div>
    </div>
  );
};

export default WeekNavigator; 