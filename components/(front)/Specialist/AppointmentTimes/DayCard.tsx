"use client";
import React from "react";
import TimeSlot from "./TimeSlot";

export interface DayData {
  fullName: string;
  shortName: string;
  date: number;
  month: string;
  isToday: boolean;
  isTomorrow: boolean;
  times: string[];
}

interface DayCardProps {
  day: DayData;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  animationDelay?: number;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  selectedTime,
  onTimeSelect,
  animationDelay = 0,
}) => {
  const getDayLabel = () => {
    if (day.isToday) return "Bugün";
    if (day.isTomorrow) return "Yarın";
    return day.shortName;
  };

  return (
    <div 
      className="flex flex-col w-full animate-fade-in"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="flex flex-col gap-1 text-center mb-3 p-2 bg-gray-50 rounded-lg w-full select-none pointer-events-none">
        <div className="text-sm font-semibold">
          {getDayLabel()}
        </div>
        <div className="text-xs text-gray-600">
          {day.date} {day.month}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {day.times.map((time: string, timeIndex: number) => (
          <TimeSlot
            key={timeIndex}
            time={time}
            isSelected={selectedTime === time}
            onClick={() => onTimeSelect?.(time)}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCard; 