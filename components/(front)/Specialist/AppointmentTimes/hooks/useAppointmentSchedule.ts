import { useState, useEffect } from "react";
import { appointmentApi, DaySchedule } from "../api/appointmentApi";
import { DayData } from "../DayCard";

export const useAppointmentSchedule = (weekIndex: number) => {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await appointmentApi.getWeeklySchedule(weekIndex);
      
      if (response.success) {
        const convertedDays: DayData[] = response.data.map((schedule: DaySchedule) => {
          const date = new Date(schedule.date);
          const dayNames = [
            "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
          ];
          const shortDayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
          
          // Eğer tatil günüyse boş array, değilse sadece müsait saatleri al
          const availableTimes = schedule.isWorkingDay 
            ? schedule.timeSlots
                .filter(slot => slot.isAvailable)
                .map(slot => slot.time)
            : [];
          
          return {
            fullName: dayNames[date.getDay()],
            shortName: shortDayNames[date.getDay()],
            date: date.getDate(),
            month: date.toLocaleDateString("tr-TR", { month: "long" }),
            isToday: date.toDateString() === new Date().toDateString(),
            isTomorrow: date.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString(),
            times: availableTimes,
            isHoliday: schedule.isHoliday,
            isWorkingDay: schedule.isWorkingDay,
            workingHours: schedule.workingHours,
            allTimeSlots: schedule.timeSlots // Tüm saatleri (dolu/boş) sakla
          };
        });
        
        setDays(convertedDays);
      } else {
        setError(response.message || "Program yüklenirken hata oluştu");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [weekIndex]);

  const refetch = () => {
    fetchSchedule();
  };

  return {
    days,
    loading,
    error,
    refetch
  };
}; 