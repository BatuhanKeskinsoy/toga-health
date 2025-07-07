import React from "react";
import DayCard, { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";

interface WeekCalendarProps {
  days: DayData[];
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  isExpanded?: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  days,
  selectedTime,
  onTimeSelect,
  isExpanded = false,
}) => {

  return (
    <div className={`w-full overflow-hidden relative transition-all duration-500 ease-in-out ${
      isExpanded ? 'h-auto' : 'lg:h-[440px] h-[410px]'
    }`}>
      <div className="grid grid-cols-4 gap-4 w-full">
        {days.map((day, dayIndex) => (
          <DayCard
            key={`${day.date}-${day.month}-${dayIndex}`}
            day={day}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
            animationDelay={dayIndex * 100}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar; 