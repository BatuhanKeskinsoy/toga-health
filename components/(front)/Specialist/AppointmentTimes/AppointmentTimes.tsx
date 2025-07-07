"use client";
import React, { useState } from "react";
import WeekNavigator from "./WeekNavigator";
import WeekCalendar from "./WeekCalendar";
import { useAppointmentData } from "./hooks/useAppointmentData";
import CustomButton from "@/components/others/CustomButton";

function AppointmentTimes() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const { getWeekData, isLoading: loading, error } = useAppointmentData();
  const currentWeek = getWeekData(currentWeekIndex);

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

  const handleTimeSelect = (timeSlotId: string) => {
    setSelectedTime(timeSlotId);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-16 bg-gray-200 rounded"></div>
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2 p-4 pb-2 h-[485px]">
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
      <hr className="border-gray-200" />
      <CustomButton
        containerStyles="flex justify-center items-center text-sm bg-sitePrimary py-3 px-2 text-white mt-2 hover:bg-sitePrimary/80"
        title="Tüm Saatleri Görüntüle"
        handleClick={() => {}}
      />
    </div>
  );
}

export default AppointmentTimes;
