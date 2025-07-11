import { useState, useEffect } from "react";
import { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";

interface AppointmentData {
  addresses: {
    [key: string]: {
      schedules: Array<{
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
      }>;
    };
  };
}

export const useAppointmentData = (selectedAddressId: string | null) => {
  const [data, setData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<DayData[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("useAppointmentData - Fetching data for address:", selectedAddressId);
        
        const response = await fetch("/api/appointments.json");
        const result = await response.json();
        
        console.log("useAppointmentData - Raw data:", result);
        
        setData(result);
      } catch (err) {
        console.error("useAppointmentData - Error fetching data:", err);
        setError("Veri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (selectedAddressId) {
      fetchData();
    } else {
      setData(null);
      setCurrentWeek([]);
      setLoading(false);
    }
  }, [selectedAddressId]);

  const getWeekData = (weekIndex: number): DayData[] => {
    if (!data || !selectedAddressId) {
      console.log("getWeekData - No data or selectedAddressId");
      return [];
    }

    console.log("getWeekData - data:", data);
    console.log("getWeekData - selectedAddressId:", selectedAddressId);

    const addressSchedules = data.addresses[selectedAddressId];
    console.log("getWeekData - addressSchedules:", addressSchedules);

    if (!addressSchedules) {
      console.log("getWeekData - addressSchedules bulunamadı");
      return [];
    }

    // En son tarihi bul
    const lastSchedule = addressSchedules.schedules[addressSchedules.schedules.length - 1];
    const lastAvailableDate = lastSchedule ? new Date(lastSchedule.date) : new Date();
    
    const days: DayData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekIndex * 4);

    console.log("getWeekData - startDate:", startDate);
    console.log("getWeekData - lastAvailableDate:", lastAvailableDate);

    // Eğer başlangıç tarihi son mevcut tarihten sonraysa boş array döndür
    if (startDate > lastAvailableDate) {
      console.log("getWeekData - startDate son mevcut tarihten sonra, boş array döndürülüyor");
      return [];
    }

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

    for (let i = 0; i < 4; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Eğer bu tarih son mevcut tarihten sonraysa döngüyü durdur
      if (date > lastAvailableDate) {
        console.log(`getWeekData - Date ${date.toISOString().split('T')[0]} son mevcut tarihten sonra, döngü durduruluyor`);
        break;
      }
      
      const dateString = date.toISOString().split('T')[0];
      console.log(`getWeekData - Checking date ${i}:`, dateString);
      
      const schedule = addressSchedules.schedules.find(s => s.date === dateString);
      console.log(`getWeekData - Schedule for ${dateString}:`, schedule);
      
      let times: string[] = [];
      let isWorkingDay = true;
      let workingHours = null;
      let isHoliday = false;

      if (schedule) {
        isWorkingDay = schedule.isWorkingDay;
        isHoliday = schedule.isHoliday;
        workingHours = schedule.workingHours;
        times = schedule.timeSlots.map(slot => slot.time);
        console.log(`getWeekData - Found schedule for ${dateString}, times:`, times);
      } else {
        console.log(`getWeekData - No schedule found for ${dateString}`);
      }

      days.push({
        fullName: dayNames[date.getDay()],
        shortName: shortDayNames[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleDateString("tr-TR", { month: "long" }),
        isToday: i === 0 && weekIndex === 0,
        isTomorrow: i === 1 && weekIndex === 0,
        times,
        isWorkingDay,
        isHoliday,
        workingHours,
        schedule: schedule || null,
      });
    }

    console.log("getWeekData - Generated days:", days);
    return days;
  };

  const setWeek = (weekIndex: number) => {
    console.log("setWeek - Setting week:", weekIndex, "for address:", selectedAddressId);
    setCurrentWeekIndex(weekIndex);
    const weekData = getWeekData(weekIndex);
    setCurrentWeek(weekData);
  };

  // Adres değiştiğinde hafta verilerini sıfırla
  useEffect(() => {
    if (selectedAddressId && data) {
      console.log("useAppointmentData - Address changed, resetting week data");
      setWeek(0); // İlk haftaya dön
    }
  }, [selectedAddressId, data]);

  return {
    data,
    loading,
    error,
    currentWeek,
    currentWeekIndex,
    setWeek,
    getWeekData,
  };
}; 