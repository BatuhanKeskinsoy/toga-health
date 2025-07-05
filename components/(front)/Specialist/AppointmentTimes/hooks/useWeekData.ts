import { useMemo } from "react";
import { DayData } from "../DayCard";

export const useWeekData = (weekIndex: number): DayData[] => {
  return useMemo(() => {
    const days: DayData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekIndex * 4);

    const dayNames = [
      "Pazar",
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
    ];
    const shortDayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

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

      days.push({
        fullName: dayNames[date.getDay()],
        shortName: shortDayNames[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleDateString("tr-TR", { month: "long" }),
        isToday: i === 0 && weekIndex === 0,
        isTomorrow: i === 1 && weekIndex === 0,
        times: defaultTimes,
      });
    }

    return days;
  }, [weekIndex]);
}; 