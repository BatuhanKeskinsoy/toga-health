import useSWR from 'swr';
import { DayData } from "../DayCard";

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

interface DaySchedule {
  date: string;
  dayOfWeek: number;
  isHoliday: boolean;
  isWorkingDay: boolean;
  workingHours: {
    start: string;
    end: string;
  } | null;
  timeSlots: TimeSlot[];
}

interface AppointmentData {
  schedules: DaySchedule[];
  settings: {
    defaultWorkingHours: {
      weekdays: { start: string; end: string };
      saturday: { start: string; end: string };
      sunday: { start: string | null; end: string | null };
    };
    holidays: string[];
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useAppointmentData = () => {
  const { data, error, isLoading, mutate } = useSWR<AppointmentData>(
    '/api/appointments.json',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000 // 30 saniyede bir yenile
    }
  );

  const getWeekData = (weekIndex: number): DayData[] => {
    if (!data) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekIndex * 4);
    
    const dayNames = [
      "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
    ];
    const shortDayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

    const weekDays: DayData[] = [];

    for (let i = 0; i < 4; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];
      
      // JSON'dan bu tarih için veri bul
      const scheduleData = data.schedules.find(s => s.date === dateString);
      
      if (scheduleData) {
        // Müsait saatleri filtrele
        const availableTimes = scheduleData.timeSlots
          .filter(slot => slot.isAvailable)
          .map(slot => slot.time);

        weekDays.push({
          fullName: dayNames[currentDate.getDay()],
          shortName: shortDayNames[currentDate.getDay()],
          date: currentDate.getDate(),
          month: currentDate.toLocaleDateString("tr-TR", { month: "long" }),
          isToday: currentDate.toDateString() === new Date().toDateString(),
          isTomorrow: currentDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString(),
          times: availableTimes,
          isHoliday: scheduleData.isHoliday,
          isWorkingDay: scheduleData.isWorkingDay,
          workingHours: scheduleData.workingHours || undefined,
          allTimeSlots: scheduleData.timeSlots
        });
      } else {
        // Eğer JSON'da bu tarih yoksa varsayılan değerler kullan
        const isHoliday = currentDate.getDay() === 0; // Pazar tatil
        const isWorkingDay = !isHoliday;
        
        weekDays.push({
          fullName: dayNames[currentDate.getDay()],
          shortName: shortDayNames[currentDate.getDay()],
          date: currentDate.getDate(),
          month: currentDate.toLocaleDateString("tr-TR", { month: "long" }),
          isToday: currentDate.toDateString() === new Date().toDateString(),
          isTomorrow: currentDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString(),
          times: isWorkingDay ? ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"] : [],
          isHoliday,
          isWorkingDay,
          workingHours: isWorkingDay ? {
            start: "09:00",
            end: currentDate.getDay() === 6 ? "13:00" : "18:00"
          } : undefined,
          allTimeSlots: isWorkingDay ? [
            { time: "09:00", isAvailable: true, isBooked: false },
            { time: "10:00", isAvailable: true, isBooked: false },
            { time: "11:00", isAvailable: true, isBooked: false },
            { time: "12:00", isAvailable: true, isBooked: false },
            { time: "13:00", isAvailable: true, isBooked: false },
            { time: "14:00", isAvailable: true, isBooked: false },
            { time: "15:00", isAvailable: true, isBooked: false },
            { time: "16:00", isAvailable: true, isBooked: false },
            { time: "17:00", isAvailable: true, isBooked: false },
            { time: "18:00", isAvailable: true, isBooked: false }
          ] : []
        });
      }
    }

    return weekDays;
  };

  return {
    data,
    error,
    isLoading,
    mutate,
    getWeekData
  };
}; 