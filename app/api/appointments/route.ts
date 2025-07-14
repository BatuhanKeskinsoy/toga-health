import { NextResponse } from 'next/server';

// Yardımcı fonksiyonlar
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
    const specialistId = searchParams.get('specialistId');
    const addressId = searchParams.get('addressId');
    const isHospital = searchParams.get('isHospital') === 'true';

    // Doktor bazlı randevu verisi
    const doctorAppointmentsData = {
      "dr-001": {
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
      "dr-002": {
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
      }
    };

    // Hastane bazlı randevu verisi
    const hospitalAppointmentsData = {
      "hospital-001": {
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
          },
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
          }
        }
      }
    };

    // Response logic
    if (isHospital) {
      // Hastane için sadece adres bazlı veri
      if (addressId) {
        const hospitalData = hospitalAppointmentsData["hospital-001"];
        if (hospitalData.addresses[addressId]) {
          return NextResponse.json({
            addresses: {
              [addressId]: hospitalData.addresses[addressId]
            }
          });
        }
      }
      return NextResponse.json(hospitalAppointmentsData["hospital-001"]);
    } else {
      // Specialist için doktor ve adres bazlı veri
      if (specialistId && addressId) {
        const specialistData = doctorAppointmentsData[specialistId];
        if (specialistData?.addresses[addressId]) {
          return NextResponse.json({
            addresses: {
              [addressId]: specialistData.addresses[addressId]
            }
          });
        }
      } else if (specialistId) {
        return NextResponse.json(doctorAppointmentsData[specialistId] || { addresses: {} });
      }
    }

    return NextResponse.json({ addresses: {} });
  } catch (error) {
    console.error('Appointments API Error:', error);
    return NextResponse.json(
      { error: 'Randevu bilgileri yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 