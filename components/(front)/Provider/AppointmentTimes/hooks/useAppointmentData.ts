import { useState, useEffect } from "react";
import { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";

interface AppointmentData {
  specialistSlug: string;
  addressId: string;
  page: number;
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
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useAppointmentData = (selectedAddressId: string | null, selectedSpecialistId?: string, isHospital?: boolean, specialistData?: any) => {
  const [data, setData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<DayData[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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
            'dr-002': 'fatma-demir',
            'dr-003': 'mehmet-kaya',
            'dr-004': 'ayse-ozkan'
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
        
        const params = new URLSearchParams();
        params.append('specialistSlug', specialistSlug);
        params.append('addressId', selectedAddressId);
        params.append('page', currentPage.toString());
        
        const response = await fetch(`/api/appointments?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
      } catch (err) {
        console.error("useAppointmentData - Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Veri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedAddressId, selectedSpecialistId, isHospital, specialistData, currentPage]);

  const getWeekData = (weekIndex: number): DayData[] => {
    if (!data || !selectedAddressId) {
      return [];
    }

    const schedules = data.schedules;

    if (!schedules || schedules.length === 0) {
      return [];
    }

    // 4 günlük veriyi direkt döndür (pagination sayesinde artık hafta hesaplamaya gerek yok)
    const days: DayData[] = [];
    
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

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      const date = new Date(schedule.date);
      
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

      // Bugün ve yarın kontrolü
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      days.push({
        fullName: dayNames[date.getDay()],
        shortName: shortDayNames[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleDateString("tr-TR", { month: "long" }),
        isToday,
        isTomorrow,
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

  const goToNextPage = () => {
    if (data?.hasNextPage) {
      setCurrentPage(currentPage + 1);
      setCurrentWeekIndex(0);
    }
  };

  const goToPreviousPage = () => {
    if (data?.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
      setCurrentWeekIndex(0);
    }
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
    currentPage,
    setWeek,
    getWeekData,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
  };
}; 