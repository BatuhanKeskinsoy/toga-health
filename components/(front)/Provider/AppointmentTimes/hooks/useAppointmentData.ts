import { useState, useEffect, useMemo } from "react";
import { DayData } from "@/components/(front)/Provider/AppointmentTimes/DayCard";
import { 
  getProviderAppointmentServices, 
  getAppointmentBookedSlots 
} from "@/lib/services/appointment/services";
import { 
  ProviderUnifiedServicesData, 
  AppointmentSlotsData,
  WorkingHour,
  BookedTimeSlot
} from "@/lib/types/appointments";
import { ProviderData, isHospitalDetailData } from "@/lib/types/provider/providerTypes";
import { useLocale } from "next-intl";

interface AppointmentSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export const useAppointmentData = (
  selectedAddressId: string | null, 
  selectedDoctorId?: string, 
  isHospital?: boolean, 
  doctorData?: ProviderData, 
  selectedDoctor?: ProviderData,
  providerData?: ProviderData,
  onList?: boolean
) => {
  const [appointmentData, setAppointmentData] = useState<ProviderUnifiedServicesData | null>(null);
  const [bookedSlots, setBookedSlots] = useState<AppointmentSlotsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDaysLimitError, setIsDaysLimitError] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<DayData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;

  // onList değiştiğinde currentPage'i sıfırla ve state'i temizle
  useEffect(() => {
    setCurrentPage(0);
    setAppointmentData(null);
    setBookedSlots(null);
    setCurrentWeek([]);
    setError(null);
    setIsDaysLimitError(false);
  }, [onList]);

  // Doktor ID'sini al
  const doctorId = useMemo(() => {
    if (isHospital && selectedDoctor) {
      // Hastane detayında selectedDoctor HospitalDoctor olabilir
      return (selectedDoctor as any).id;
    } else if (!isHospital && doctorData) {
      // Doktor detay sayfasında doctorData zaten doktor bilgilerini içeriyor
      return (doctorData as any).id;
    }
    return null;
  }, [isHospital, selectedDoctor, doctorData]);

  // Corporate ID'sini al (hastane detayında)
  const corporateId = useMemo(() => {
    if (isHospital && providerData && isHospitalDetailData(providerData)) {
      return (providerData as any).id;
    }
    return undefined;
  }, [isHospital, providerData]);

    // API verilerini çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // onList değişikliğinden sonra state temizlendiğinde, 
        // API isteğini atmayı önlemek için kısa bir kontrol
        // (Bu, onList değiştiğinde temizlenen state'in üzerine yazılmasını önler)
        
        // Hastane detayında: doctorId ve corporateId gerekli (address_id gerekli değil)
        // Doktor detayında: doctorId ve selectedAddressId gerekli
        if (isHospital) {
          if (!doctorId || !corporateId) {
            setAppointmentData(null);
            setBookedSlots(null);
            setCurrentWeek([]);
            setLoading(false);
            return;
          }
        } else {
          if (!selectedAddressId || !doctorId) {
            setAppointmentData(null);
            setBookedSlots(null);
            setCurrentWeek([]);
            setLoading(false);
            return;
          }
        }

        // Her iki API'yi paralel olarak çağır
        // onList modunda: currentPage'e göre gün sayısını hesapla (ilk sayfa için 1, ikinci sayfa için 2, vs.)
        // Normal modda: currentPage'e göre gün sayısını hesapla: ilk sayfa için 4 gün, her sayfada 4 gün daha
        const calculatedDays = onList ? (currentPage + 1) : (4 + (currentPage * 4));
          
          // 30 günden fazla ise direkt hata göster
          if (calculatedDays > 30) {
          setIsDaysLimitError(true);
          setError(null);
          setAppointmentData(null);
          setBookedSlots(null);
          setCurrentWeek([]);
          setLoading(false);
          return;
        }
        
        setIsDaysLimitError(false);
        const daysToFetch = calculatedDays;
        
        try {
          // Hastane detayında: corporate_id gönder, address_id gönderme
          // Doktor detayında: address_id gönder, corporate_id gönderme
          const [appointmentServices, bookedSlotsData] = await Promise.all([
            getProviderAppointmentServices(
              doctorId, 
              isHospital ? undefined : selectedAddressId, // Hastane detayında address_id göndermiyoruz
              isHospital ? corporateId : undefined // Hastane detayında corporate_id gönderiyoruz
            ),
            getAppointmentBookedSlots(
              doctorId,
              isHospital ? undefined : selectedAddressId, // Doktor detayında address_id gönderiyoruz
              isHospital ? corporateId : undefined, // Hastane detayında corporate_id gönderiyoruz
              daysToFetch
            )
          ]);

          if (appointmentServices.success) {
            setAppointmentData(appointmentServices.data);
          }
          
          if (bookedSlotsData.status) {
            setBookedSlots(bookedSlotsData.data);
          }
        } catch (apiError: any) {
          // 422 hatası kontrolü - gün sayısı limiti
          if (apiError?.response?.status === 422) {
            const errorMessage = apiError?.response?.data?.message || apiError?.response?.data?.errors?.days?.[0];
            if (errorMessage && (errorMessage.includes("30") || errorMessage.includes("Gün sayısı"))) {
              setIsDaysLimitError(true);
              setError(null);
              setAppointmentData(null);
              setBookedSlots(null);
              setCurrentWeek([]);
              setLoading(false);
              return;
            }
          }
          throw apiError;
        }
      } catch (err: any) {
        console.error("useAppointmentData - Error fetching data:", err);
        // 422 hatası değilse normal hata mesajını göster
        if (err?.response?.status !== 422) {
          setError(err instanceof Error ? err.message : "Veri yüklenirken hata oluştu");
        } else {
          // 422 hatası ama gün sayısı hatası değilse
          setIsDaysLimitError(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedAddressId, doctorId, currentPage, isHospital, corporateId, onList]);

  // Randevu saatlerini oluştur
  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    duration: number
  ): string[] => {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Start time'i total dakikaya çevir
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    let currentTotalMinutes = startTotalMinutes;
    
    while (currentTotalMinutes < endTotalMinutes) {
      const hour = Math.floor(currentTotalMinutes / 60);
      const minute = currentTotalMinutes % 60;
      const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push(timeString);
      
      currentTotalMinutes += duration;
    }
    
    return slots;
  };

  // Belirli bir tarihe ait çalışma saatlerini al
  const getWorkingHoursForDate = (date: Date): WorkingHour | null => {
    if (!appointmentData) return null;
    
    const dayIndex = date.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
    const dayMap: { [key: number]: string } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    const dayName = dayMap[dayIndex];
    return appointmentData.address.working_hours.find(
      wh => wh.day.toLowerCase() === dayName
    ) || null;
  };

  // Belirli bir tarihe ait booked slotları filtrele
  const getBookedSlotsForDate = (date: Date): BookedTimeSlot[] => {
    if (!bookedSlots) return [];
    
    // Local timezone'da tarihi formatla (UTC yerine)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return bookedSlots.all_booked_time_slots.filter(
      slot => slot.date === dateString
    );
  };

  // 4 günlük takvim verisini oluştur
  useEffect(() => {
    if (!appointmentData || !bookedSlots) {
      return;
    }

    const days: DayData[] = [];

    // Bugün ve yarın kontrolü
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Liste görünümünde sadece tek gün, normal görünümde 4 gün
    const daysToGenerate = onList ? 1 : 4;
    const dayOffset = onList ? currentPage : currentPage * 4;

    // Veri oluştur
    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i + dayOffset);

      const workingHour = getWorkingHoursForDate(date);
      const bookedSlotsForDate = getBookedSlotsForDate(date);

      const isWorkingDay = workingHour?.is_working_day || false;
      const isHoliday = !isWorkingDay;

      // Saatleri oluştur
      let appointmentSlots: AppointmentSlot[] = [];
      if (isWorkingDay && workingHour) {
        const allSlots = generateTimeSlots(
          workingHour.start_time,
          workingHour.end_time,
          appointmentData.address.appointment_duration
        );

        appointmentSlots = allSlots.map(time => {
          // Booked slotları kontrol et
          // Bir slot dolu ise, o slotun başlangıç saati ile bitiş saati arasında olan tüm slotlar dolu olmalı
          const isBooked = bookedSlotsForDate.some(bs => {
            // Slot'un başlangıcı dolu slotun başlangıcından sonra veya eşit
            // ve slot'un başlangıcı dolu slotun bitişinden önce olmalı
            return time >= bs.start_time && time < bs.end_time;
          });

          return {
            time,
            isAvailable: true,
            isBooked
          };
        });
      }

      const isToday = date.toDateString() === today.toDateString();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      days.push({
        fullName: date.toLocaleDateString(fullLocale, { weekday: "long" }),
        date: date.getDate(),
        month: date.toLocaleDateString(fullLocale, { month: "long" }),
        isToday,
        isTomorrow,
        times: appointmentSlots.map(slot => slot.time),
        isWorkingDay,
        isHoliday,
        workingHours: workingHour ? {
          start: workingHour.start_time,
          end: workingHour.end_time
        } : undefined,
        schedule: {
          date: (() => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          })(),
          dayOfWeek: date.getDay(),
          isHoliday,
          isWorkingDay,
          workingHours: workingHour ? {
            start: workingHour.start_time,
            end: workingHour.end_time
          } : null,
          timeSlots: appointmentSlots
        }
      });
    }

    setCurrentWeek(days);
  }, [appointmentData, bookedSlots, currentPage, onList]);

  const goToNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const resetToToday = () => {
    setCurrentPage(0);
    setIsDaysLimitError(false);
    setError(null);
  };

  return {
    loading,
    error,
    isDaysLimitError,
    currentWeek,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    resetToToday,
    hasNextPage: true, // Artık pagination yok, her zaman ileri gidebilir
    hasPreviousPage: currentPage > 0,
    appointmentData, // Servis ve randevu bilgileri
  };
}; 