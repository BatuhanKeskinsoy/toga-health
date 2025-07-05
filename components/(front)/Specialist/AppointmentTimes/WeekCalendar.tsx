"use client";
import React from "react";
import DayCard, { DayData } from "./DayCard";

interface WeekCalendarProps {
  days: DayData[];
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  days,
  selectedTime,
  onTimeSelect,
}) => {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="transition-all duration-500 ease-in-out">
        <div className="grid grid-cols-4 gap-4 w-full">
          {days.map((day, dayIndex) => (
            <DayCard
              key={dayIndex}
              day={day}
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar; 