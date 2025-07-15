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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialistSlug = searchParams.get('specialistSlug');
    const addressId = searchParams.get('addressId');

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
            schedules: generateSchedule("2025-01-14", 8, { start: "08:00", end: "17:00" }, [
              [9, 12, 15], // 14 Ocak - dolu saatler
              [8, 11, 14], // 15 Ocak
              [10, 13, 16], // 16 Ocak
              [], // 17 Ocak - tatil
              [8, 11, 14], // 18 Ocak
              [9, 12], // 19 Ocak - yarım gün
              [], // 20 Ocak - tatil
              [10, 13, 16] // 21 Ocak
            ])
          },
          "addr-004": {
            schedules: generateSchedule("2025-01-14", 8, { start: "09:00", end: "18:00" }, [
              [10, 13, 16], // 14 Ocak
              [9, 12, 15], // 15 Ocak
              [11, 14, 17], // 16 Ocak
              [], // 17 Ocak - tatil
              [10, 13, 16], // 18 Ocak
              [9, 12], // 19 Ocak - yarım gün
              [], // 20 Ocak - tatil
              [11, 14, 17] // 21 Ocak
            ])
          }
        }
      },
      "ayse-demir": {
        addresses: {
          "addr-002": {
            schedules: generateSchedule("2025-01-14", 8, { start: "09:00", end: "18:00" }, [
              [10, 13, 16],
              [9, 12, 15],
              [11, 14, 17],
              [],
              [10, 13, 16],
              [9, 12],
              [],
              [11, 14, 17]
            ])
          },
          "addr-003": {
            schedules: generateSchedule("2025-01-14", 8, { start: "10:00", end: "19:00" }, [
              [11, 14, 17],
              [10, 13, 16],
              [12, 15, 18],
              [],
              [11, 14, 17],
              [10, 13],
              [],
              [12, 15, 18]
            ])
          }
        }
      },
      "mehmet-kaya": {
        addresses: {
          "addr-001": {
            schedules: generateSchedule("2025-01-14", 8, { start: "08:00", end: "17:00" }, [
              [9, 12, 15],
              [8, 11, 14],
              [10, 13, 16],
              [],
              [8, 11, 14],
              [9, 12],
              [],
              [10, 13, 16]
            ])
          }
        }
      }
    };

    const specialistData = appointmentsData[specialistSlug];
    
    if (!specialistData) {
      return NextResponse.json(
        { error: 'Uzman bulunamadı' },
        { status: 404 }
      );
    }

    const addressData = specialistData.addresses[addressId];
    
    if (!addressData) {
      return NextResponse.json(
        { error: 'Adres bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      specialistSlug,
      addressId,
      schedules: addressData.schedules
    });

  } catch (error) {
    console.error('Appointments API Error:', error);
    return NextResponse.json(
      { error: 'Randevu bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 