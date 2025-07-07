export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD format
  isHoliday: boolean;
  isWorkingDay: boolean;
  timeSlots: TimeSlot[];
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface AppointmentApiResponse {
  success: boolean;
  data: DaySchedule[];
  message?: string;
}

// Fake data - gerçek uygulamada bu veriler veritabanından gelecek
const generateFakeSchedule = (startDate: Date, daysCount: number): DaySchedule[] => {
  const schedules: DaySchedule[] = [];
  
  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dateString = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay();
    
    // Pazar günleri tatil
    const isHoliday = dayOfWeek === 0;
    
    // Cumartesi günleri yarım gün
    const isHalfDay = dayOfWeek === 6;
    
    // Rastgele bazı günleri tatil yap (test için)
    const randomHoliday = Math.random() < 0.1; // %10 ihtimalle tatil
    
    const isWorkingDay = !isHoliday && !randomHoliday;
    
    let timeSlots: TimeSlot[] = [];
    
    if (isWorkingDay) {
      const baseTimes = [
        "09:00", "10:00", "11:00", "12:00", "13:00", 
        "14:00", "15:00", "16:00", "17:00", "18:00"
      ];
      
      // Cumartesi günleri sadece sabah saatleri
      const workingTimes = isHalfDay ? baseTimes.slice(0, 5) : baseTimes;
      
      timeSlots = workingTimes.map(time => {
        // Rastgele bazı saatleri dolu yap
        const isBooked = Math.random() < 0.3; // %30 ihtimalle dolu
        const isAvailable = !isBooked;
        
        return {
          time,
          isAvailable,
          isBooked
        };
      });
    }
    
    schedules.push({
      date: dateString,
      isHoliday: !isWorkingDay,
      isWorkingDay,
      timeSlots,
      workingHours: isWorkingDay ? {
        start: isHalfDay ? "09:00" : "09:00",
        end: isHalfDay ? "13:00" : "18:00"
      } : undefined
    });
  }
  
  return schedules;
};

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentApi = {
  // Haftalık randevu programını getir
  async getWeeklySchedule(weekIndex: number): Promise<AppointmentApiResponse> {
    await delay(500); // Simulated network delay
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekIndex * 4);
    
    try {
      const schedules = generateFakeSchedule(startDate, 4);
      
      return {
        success: true,
        data: schedules,
        message: "Haftalık program başarıyla getirildi"
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: "Program getirilirken hata oluştu"
      };
    }
  },
  
  // Belirli bir günün programını getir
  async getDaySchedule(date: string): Promise<AppointmentApiResponse> {
    await delay(300);
    
    const targetDate = new Date(date);
    const schedules = generateFakeSchedule(targetDate, 1);
    
    return {
      success: true,
      data: schedules,
      message: "Günlük program başarıyla getirildi"
    };
  },
  
  // Randevu al
  async bookAppointment(date: string, time: string): Promise<{ success: boolean; message: string }> {
    await delay(800);
    
    // Simulated booking logic
    const isSuccess = Math.random() > 0.1; // %90 başarı oranı
    
    if (isSuccess) {
      return {
        success: true,
        message: "Randevu başarıyla alındı"
      };
    } else {
      return {
        success: false,
        message: "Bu saat dolu, lütfen başka bir saat seçin"
      };
    }
  },
  
  // Randevu iptal et
  async cancelAppointment(date: string, time: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    
    return {
      success: true,
      message: "Randevu başarıyla iptal edildi"
    };
  }
}; 