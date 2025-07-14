"use client";
import React from "react";
import TimeSlot from "@/components/(front)/Provider/AppointmentTimes/TimeSlot";
import { IoCalendarOutline } from "react-icons/io5";

export interface DayData {
  fullName: string;
  shortName: string;
  date: number;
  month: string;
  isToday: boolean;
  isTomorrow: boolean;
  times: string[];
  isHoliday?: boolean;
  isWorkingDay?: boolean;
  workingHours?: {
    start: string;
    end: string;
  };
  allTimeSlots?: Array<{
    time: string;
    isAvailable: boolean;
    isBooked: boolean;
  }>;
  schedule?: {
    date: string;
    dayOfWeek: number;
    isHoliday: boolean;
    isWorkingDay: boolean;
    workingHours: {
      start: string;
      end: string;
    } | null;
    timeSlots: Array<{
      time: string;
      isAvailable: boolean;
      isBooked: boolean;
    }>;
  } | null;
}

interface DayCardProps {
  day: DayData;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  animationDelay?: number;
  isExpanded?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  selectedTime,
  onTimeSelect,
  animationDelay = 0,
  isExpanded = false,
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
        animationFillMode: "both",
      }}
    >
      <div
        className={`flex flex-col gap-1 text-center mb-3 p-2 rounded-lg w-full select-none pointer-events-none ${
          day.isHoliday
            ? "bg-gray-100 border border-dashed border-gray-400 opacity-50"
            : "bg-gray-50"
        }`}
      >
        <div className="text-sm font-semibold">{getDayLabel()}</div>
        <div className="text-xs text-gray-600">
          {day.date} {day.month}
        </div>
        {day.isHoliday && (
          <div className="text-xs text-gray-400 font-medium">Mesai Dışı</div>
        )}
        {day.isWorkingDay && day.workingHours && (
          <div className="text-xs text-green-600">
            {day.workingHours.start} - {day.workingHours.end}
          </div>
        )}
      </div>

      <div
        className={`flex flex-col gap-2 w-full ${
          !isExpanded ? "lg:h-[265px] h-[220px]" : "h-full"
        }`}
      >
        {day.isHoliday ||
        (day.schedule && day.schedule.timeSlots.length === 0) ||
        (day.allTimeSlots && day.allTimeSlots.length === 0) ||
        (day.times && day.times.length === 0) ? (
          <div className="flex flex-col text-center items-center justify-center bg-gray-100 border border-dashed border-gray-400 opacity-50 rounded-md select-none pointer-events-none h-full">
            <IoCalendarOutline className="text-2xl mb-2" />
            <div className="text-xs font-medium mb-1">
              Bu Güne Ait Takvim Yok
            </div>
          </div>
        ) : day.schedule ? (
          // API'den gelen schedule verisini kullan
          day.schedule.timeSlots.map((slot, timeIndex: number) => {
            const timeSlotId = `${day.date}-${day.month}-${slot.time}`;
            return (
              <TimeSlot
                key={timeIndex}
                time={slot.time}
                isSelected={selectedTime === timeSlotId}
                isAvailable={slot.isAvailable}
                isBooked={slot.isBooked}
                onClick={() => onTimeSelect?.(timeSlotId)}
              />
            );
          })
        ) : day.allTimeSlots ? (
          // Fallback: allTimeSlots kullan
          day.allTimeSlots.map((slot, timeIndex: number) => {
            const timeSlotId = `${day.date}-${day.month}-${slot.time}`;
            return (
              <TimeSlot
                key={timeIndex}
                time={slot.time}
                isSelected={selectedTime === timeSlotId}
                isAvailable={slot.isAvailable}
                isBooked={slot.isBooked}
                onClick={() => onTimeSelect?.(timeSlotId)}
              />
            );
          })
        ) : (
          // Fallback: sadece müsait saatleri göster
          day.times.map((time: string, timeIndex: number) => {
            const timeSlotId = `${day.date}-${day.month}-${time}`;
            return (
              <TimeSlot
                key={timeIndex}
                time={time}
                isSelected={selectedTime === timeSlotId}
                onClick={() => onTimeSelect?.(timeSlotId)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default DayCard;
