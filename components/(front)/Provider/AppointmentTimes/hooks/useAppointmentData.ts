import { useState, useEffect } from "react";
import { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";

interface AppointmentData {
  specialistSlug: string;
  addressId: string;
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
        
        if (!selectedAddressId) {
          setData(null);
          setCurrentWeek([]);
          setLoading(false);
          return;
        }

        // Specialist slug'ını belirle
        let specialistSlug = '';
        
        if (isHospital && selectedSpecialistId) {
          // Hastane sayfasında seçilen uzmanın slug'ını bul
          // Bu kısım gerçek uygulamada veritabanından gelecek
          // Şimdilik test için sabit değerler kullanıyoruz
          const specialistSlugMap: { [key: string]: string } = {
            'dr-001': 'ahmet-yilmaz',
            'dr-002': 'ayse-demir',
            'dr-003': 'mehmet-kaya'
          };
          specialistSlug = specialistSlugMap[selectedSpecialistId] || 'ahmet-yilmaz';
        } else if (!isHospital && specialistData?.slug) {
          // Uzman sayfasında uzmanın kendi slug'ı
          specialistSlug = specialistData.slug;
        } else {
          setError("Uzman bilgisi bulunamadı");
          setLoading(false);
          return;
        }
        
        console.log('API Request:', { specialistSlug, selectedAddressId });
        
        // API parametrelerini oluştur
        const params = new URLSearchParams();
        params.append('specialistSlug', specialistSlug);
        params.append('addressId', selectedAddressId);
        
        const response = await fetch(`/api/appointments?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        console.log('API Response:', result);
        setData(result);
      } catch (err) {
        console.error("useAppointmentData - Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Veri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedAddressId, selectedSpecialistId, isHospital, specialistData]);

  const getWeekData = (weekIndex: number): DayData[] => {
    if (!data || !selectedAddressId) {
      return [];
    }

    const schedules = data.schedules;

    if (!schedules || schedules.length === 0) {
      return [];
    }

    // En son tarihi bul
    const lastSchedule = schedules[schedules.length - 1];
    const lastAvailableDate = lastSchedule ? new Date(lastSchedule.date) : new Date();
    
    const days: DayData[] = [];
    
    // API'deki ilk tarihi bul
    const firstSchedule = schedules[0];
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
      
      const schedule = schedules.find(s => s.date === dateString);
      
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