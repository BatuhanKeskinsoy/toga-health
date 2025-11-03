import React from "react";
import DayCard, { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";
import { IoCalendarOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

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
  const t = useTranslations()
  if (days.length === 0) {
    return (
      <div className={`w-full overflow-hidden relative transition-all duration-500 ease-in-out`}>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="text-gray-500 mb-2">
            <IoCalendarOutline className="text-4xl mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">{t('Bu Tarihten Sonra Randevu Yok')}</p>
            <p className="text-sm text-gray-400">
              {t('Seçilen tarihten sonra müsait randevu saati bulunmamaktadır')}
            </p>
          </div>
        </div>
      </div>
    );
  }

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