import React from "react";
import DayCard, { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";

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
    <div className={`w-full overflow-hidden relative transition-transform duration-500 ease-in-out`}>
      <div className="grid grid-cols-4 gap-4 w-full">
        {days.map((day, dayIndex) => (
          <DayCard
            key={`${day.date}-${day.month}-${dayIndex}`}
            day={day}
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
            animationDelay={dayIndex * 100}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar; 