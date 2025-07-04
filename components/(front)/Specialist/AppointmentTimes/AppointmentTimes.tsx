"use client"
import React, { useState } from 'react';
import { IoCalendar, IoTime, IoCheckmark } from 'react-icons/io5';

function AppointmentTimes() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Örnek günler (bugünden başlayarak 7 gün)
  const getDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('tr-TR', { month: 'short' }),
        isToday: i === 0,
        isAvailable: i < 5 // İlk 5 gün müsait
      });
    }
    
    return days;
  };

  // Örnek saatler
  const timeSlots = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: false },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '12:30', available: false },
    { time: '13:00', available: false },
    { time: '13:30', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Saat seçimini sıfırla
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleAppointment = () => {
    if (selectedDate && selectedTime) {
      alert(`Randevu alındı: ${selectedDate} - ${selectedTime}`);
      // Burada API çağrısı yapılacak
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Başlık */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Randevu Saatleri</h2>
        <p className="text-gray-600">Uygun gün ve saati seçerek randevu alabilirsiniz</p>
      </div>

      {/* Günler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <IoCalendar className="text-sitePrimary text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Gün Seçin</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {getDays().map((day) => (
            <button
              key={day.date}
              onClick={() => handleDateSelect(day.date)}
              disabled={!day.isAvailable}
              className={`
                flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
                ${selectedDate === day.date 
                  ? 'border-sitePrimary bg-sitePrimary/5 text-sitePrimary' 
                  : day.isAvailable 
                    ? 'border-gray-200 hover:border-sitePrimary/50 hover:bg-gray-50 text-gray-700' 
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }
                ${day.isToday ? 'ring-2 ring-sitePrimary/20' : ''}
              `}
            >
              <span className="text-xs font-medium uppercase">{day.day}</span>
              <span className="text-lg font-bold">{day.dayNumber}</span>
              <span className="text-xs text-gray-500">{day.month}</span>
              {day.isToday && (
                <span className="text-xs bg-sitePrimary text-white px-1 rounded mt-1">Bugün</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Saatler */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <IoTime className="text-sitePrimary text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">
              Saat Seçin - {new Date(selectedDate).toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`
                  flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200
                  ${selectedTime === slot.time 
                    ? 'border-sitePrimary bg-sitePrimary text-white' 
                    : slot.available 
                      ? 'border-gray-200 hover:border-sitePrimary/50 hover:bg-gray-50 text-gray-700' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <span className="font-medium">{slot.time}</span>
                {selectedTime === slot.time && (
                  <IoCheckmark className="ml-2 text-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Randevu Butonu */}
      {selectedDate && selectedTime && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Randevu Özeti</h3>
            <p className="text-gray-600 mb-4">
              {new Date(selectedDate).toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - {selectedTime}
            </p>
            <button
              onClick={handleAppointment}
              className="bg-sitePrimary hover:bg-sitePrimary/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Randevu Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentTimes;