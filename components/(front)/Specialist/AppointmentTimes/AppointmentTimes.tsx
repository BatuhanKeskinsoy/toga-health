"use client";
import React, { useState } from "react";
import WeekNavigator from "./WeekNavigator";
import WeekCalendar from "./WeekCalendar";
import { useWeekData } from "./hooks/useWeekData";

function AppointmentTimes() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  const currentWeek = useWeekData(currentWeekIndex);

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setSlideDirection("right");
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    setSlideDirection("left");
    setCurrentWeekIndex(currentWeekIndex + 1);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <WeekNavigator
        currentMonth={currentWeek[0]?.month || ""}
        currentYear={new Date().getFullYear()}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        canGoPrevious={currentWeekIndex > 0}
      />

      <hr className="border-gray-200" />

      <WeekCalendar
        days={currentWeek}
        selectedTime={selectedTime}
        onTimeSelect={handleTimeSelect}
        direction={slideDirection}
      />
    </div>
  );
}

export default AppointmentTimes;
