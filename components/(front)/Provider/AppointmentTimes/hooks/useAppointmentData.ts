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

export const useAppointmentData = (selectedAddressId: string | null, selectedSpecialistId?: string, isHospital?: boolean, specialistData?: any) => {
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
        
        // API parametrelerini oluştur
        const params = new URLSearchParams();
        params.append('addressId', selectedAddressId || '');
        
        // Hastane sayfasında doktor seçilmişse doktor bazlı veri iste
        if (selectedSpecialistId && isHospital) {
          params.append('specialistId', selectedSpecialistId);
          params.append('isHospital', 'true');
        }
        // Specialist sayfasında ise specialistData'dan doktor ID'sini al
        else if (!isHospital && specialistData?.id) {
          params.append('specialistId', specialistData.id);
        }
        
        const response = await fetch(`/api/appointments?${params.toString()}`);
        const result = await response.json();
        
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
  }, [selectedAddressId, selectedSpecialistId, isHospital]);

  const getWeekData = (weekIndex: number): DayData[] => {
    if (!data || !selectedAddressId) {
      return [];
    }

    const addressSchedules = data.addresses[selectedAddressId];

    if (!addressSchedules) {
      return [];
    }

    // En son tarihi bul
    const lastSchedule = addressSchedules.schedules[addressSchedules.schedules.length - 1];
    const lastAvailableDate = lastSchedule ? new Date(lastSchedule.date) : new Date();
    
    const days: DayData[] = [];
    
    // API'deki ilk tarihi bul
    const firstSchedule = addressSchedules.schedules[0];
    const firstAvailableDate = firstSchedule ? new Date(firstSchedule.date) : new Date();
    
    // Hafta indeksine göre tarihi ayarla (0 = ilk tarih, 1 = 4 gün sonra, vs.)
    const startDate = new Date(firstAvailableDate);
    startDate.setDate(startDate.getDate() + weekIndex * 4);

    // Eğer başlangıç tarihi son mevcut tarihten sonraysa boş array döndür
    if (startDate > lastAvailableDate) {
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
        break;
      }
      
      const dateString = date.toISOString().split('T')[0];
      
      const schedule = addressSchedules.schedules.find(s => s.date === dateString);
      
      let times: string[] = [];
      let isWorkingDay = true;
      let workingHours = null;
      let isHoliday = false;

      if (schedule) {
        isWorkingDay = schedule.isWorkingDay;
        isHoliday = schedule.isHoliday;
        workingHours = schedule.workingHours;
        times = schedule.timeSlots.map(slot => slot.time);  
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
    return days;
  };

  const setWeek = (weekIndex: number) => {
    setCurrentWeekIndex(weekIndex);
    const weekData = getWeekData(weekIndex);
    setCurrentWeek(weekData);
  };

  useEffect(() => {
    if (selectedAddressId && data) {
      setCurrentWeekIndex(0);
      const weekData = getWeekData(0);
      setCurrentWeek(weekData);
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