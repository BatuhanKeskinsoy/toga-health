import { NextResponse } from 'next/server';

const generateTimeSlots = (startHour: number, endHour: number, bookedSlots: number[] = []) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    const isBooked = bookedSlots.includes(hour);
    slots.push({
      time,
      isAvailable: !isBooked,
      isBooked
    });
  }
  return slots;
};

const generateSchedule = (startDate: string, days: number, workingHours: { start: string, end: string }, bookedSlots: number[][] = []) => {
  const schedules = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    const dayOfWeek = currentDate.getDay();
    const isHoliday = dayOfWeek === 0 || dayOfWeek === 6; // Pazar ve Cumartesi tatil
    const isWorkingDay = !isHoliday;
    
    const dateStr = currentDate.toISOString().split('T')[0];
    const startHour = parseInt(workingHours.start.split(':')[0]);
    const endHour = parseInt(workingHours.end.split(':')[0]);
    
    schedules.push({
      date: dateStr,
      dayOfWeek,
      isHoliday,
      isWorkingDay,
      workingHours: isWorkingDay ? workingHours : null,
      timeSlots: isWorkingDay ? generateTimeSlots(startHour, endHour, bookedSlots[i] || []) : []
    });
  }
  
  return schedules;
};

// Bugünden itibaren 4 günlük veri oluştur
const generateCurrentWeekSchedule = (workingHours: { start: string, end: string }, bookedSlots: number[][] = []) => {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  return generateSchedule(startDate, 4, workingHours, bookedSlots);
};

// Belirli bir sayfadan itibaren 4 günlük veri oluştur
const generatePageSchedule = (page: number, workingHours: { start: string, end: string }, bookedSlots: number[][] = []) => {
  const today = new Date();
  today.setDate(today.getDate() + (page * 4));
  const startDate = today.toISOString().split('T')[0];
  return generateSchedule(startDate, 4, workingHours, bookedSlots);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialistSlug = searchParams.get('specialistSlug');
    const addressId = searchParams.get('addressId');
    const page = parseInt(searchParams.get('page') || '0');

    if (!specialistSlug || !addressId) {
      return NextResponse.json(
        { error: 'specialistSlug ve addressId parametreleri gerekli' },
        { status: 400 }
      );
    }

    // Test verileri - gerçek uygulamada bu veriler veritabanından gelecek
    const appointmentsData = {
      "ahmet-yilmaz": {
        addresses: {
          "addr-001": {
            workingHours: { start: "08:00", end: "17:00" },
            bookedSlots: [
              [9, 12, 15], // Bugün
              [8, 11, 14], // Yarın
              [10, 13, 16], // 3. gün
              [8, 11, 14], // 4. gün
            ]
          },
          "addr-004": {
            workingHours: { start: "09:00", end: "18:00" },
            bookedSlots: [
              [10, 13, 16], // Bugün
              [9, 12, 15], // Yarın
              [11, 14, 17], // 3. gün
              [10, 13, 16], // 4. gün
            ]
          },
          "addr-005": {
            workingHours: { start: "10:00", end: "19:00" },
            bookedSlots: [
              [11, 14, 17], // Bugün
              [10, 13, 16], // Yarın
              [12, 15, 18], // 3. gün
              [11, 14, 17], // 4. gün
            ]
          }
        }
      },
      "ayse-demir": {
        addresses: {
          "addr-002": {
            workingHours: { start: "09:00", end: "18:00" },
            bookedSlots: [
              [10, 13, 16],
              [9, 12, 15],
              [11, 14, 17],
              [10, 13, 16],
            ]
          },
          "addr-003": {
            workingHours: { start: "10:00", end: "19:00" },
            bookedSlots: [
              [11, 14, 17],
              [10, 13, 16],
              [12, 15, 18],
              [11, 14, 17],
            ]
          }
        }
      },
      "mehmet-kaya": {
        addresses: {
          "addr-001": {
            workingHours: { start: "08:00", end: "17:00" },
            bookedSlots: [
              [9, 12, 15],
              [8, 11, 14],
              [10, 13, 16],
              [8, 11, 14],
            ]
          },
          "addr-007": {
            workingHours: { start: "09:00", end: "18:00" },
            bookedSlots: [
              [10, 13, 16],
              [9, 12, 15],
              [11, 14, 17],
              [10, 13, 16],
            ]
          }
        }
      },
      "ayse-ozkan": {
        addresses: {
          "addr-008": {
            workingHours: { start: "08:00", end: "17:00" },
            bookedSlots: [
              [9, 12, 15],
              [8, 11, 14],
              [10, 13, 16],
              [8, 11, 14],
            ]
          }
        }
      }
    };

    // Eğer uzman verisi yoksa, varsayılan çalışma saatleri ile veri oluştur
    const defaultWorkingHours = { start: "09:00", end: "18:00" };
    const defaultBookedSlots = [
      [10, 13, 16], // Bugün
      [9, 12, 15], // Yarın
      [11, 14, 17], // 3. gün
      [10, 13, 16], // 4. gün
    ];

    let specialistData = appointmentsData[specialistSlug];
    
    // Eğer uzman verisi yoksa, varsayılan veri oluştur
    if (!specialistData) {
      specialistData = {
        addresses: {
          [addressId]: {
            workingHours: defaultWorkingHours,
            bookedSlots: defaultBookedSlots
          }
        }
      };
    }

    let addressData = specialistData.addresses[addressId];
    
    // Eğer adres verisi yoksa, varsayılan veri oluştur
    if (!addressData) {
      addressData = {
        workingHours: defaultWorkingHours,
        bookedSlots: defaultBookedSlots
      };
    }

    // Sayfa parametresine göre veri oluştur
    let schedules;
    if (page === 0) {
      // İlk sayfa: bugünden itibaren 4 gün
      schedules = generateCurrentWeekSchedule(addressData.workingHours, addressData.bookedSlots);
    } else {
      // Diğer sayfalar: belirli sayfadan itibaren 4 gün
      schedules = generatePageSchedule(page, addressData.workingHours, addressData.bookedSlots);
    }

    return NextResponse.json({
      specialistSlug,
      addressId,
      page,
      schedules,
      hasNextPage: page < 10, // Test için 10 sayfa limit
      hasPreviousPage: page > 0
    });

  } catch (error) {
    console.error('Appointments API Error:', error);
    return NextResponse.json(
      { error: 'Randevu bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 