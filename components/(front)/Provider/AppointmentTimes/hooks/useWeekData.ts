import { useMemo } from "react";
import { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";
import { useLocale } from "next-intl";

export const useWeekData = (weekIndex: number): DayData[] => {
  
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  return useMemo(() => {
    const days: DayData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekIndex * 4);

    const defaultTimes = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
    ];

    for (let i = 0; i < 4; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Tarih bilgisinden gün adını al (API'den gelmediği için fallback)
      const dayName = date.toLocaleDateString(fullLocale, { weekday: "long" });

      days.push({
        fullName: dayName,
        date: date.getDate(),
        month: date.toLocaleDateString(fullLocale, { month: "long" }),
        isToday: i === 0 && weekIndex === 0,
        isTomorrow: i === 1 && weekIndex === 0,
        times: defaultTimes,
      });
    }

    return days;
  }, [weekIndex, locale]);
}; 