"use client"
import CustomButton from "@/components/others/CustomButton";
import React, { useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

function AppointmentTimes() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Haftalık veri oluşturma
  const generateWeekData = (weekIndex: number) => {
    const days = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (weekIndex * 4));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const shortDayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      
      days.push({
        fullName: dayNames[date.getDay()],
        shortName: shortDayNames[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleDateString('tr-TR', { month: 'long' }),
        isToday: i === 0 && weekIndex === 0,
        isTomorrow: i === 1 && weekIndex === 0,
        times: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
      });
    }
    
    return days;
  };

  const currentWeek = generateWeekData(currentWeekIndex);
  const visibleDays = currentWeek.slice(0, 4); // Sadece 4 gün göster

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentWeekIndex(currentWeekIndex - 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const handleNextWeek = () => {
    setSlideDirection('left');
    setTimeout(() => {
      setCurrentWeekIndex(currentWeekIndex + 1);
      setSlideDirection(null);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Başlık ve Navigasyon */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">
          {visibleDays[0]?.month} {new Date().getFullYear()}
        </span>
        <div className="flex gap-2">
          <CustomButton 
            leftIcon={<IoArrowBack />} 
            handleClick={handlePreviousWeek}
            isDisabled={currentWeekIndex === 0}
            containerStyles="h-10 w-10"
          />
          <CustomButton 
            rightIcon={<IoArrowForward />} 
            handleClick={handleNextWeek}
            containerStyles="h-10 w-10"
          />
        </div>
      </div>
      
      <hr className="border-gray-200" />
      
      {/* Günler ve Saatler Grid */}
      <div className="w-full overflow-hidden">
        <div 
          className={`grid grid-cols-4 gap-4 w-full transition-transform duration-300 ease-in-out ${
            slideDirection === 'left' ? 'transform -translate-x-full' : 
            slideDirection === 'right' ? 'transform translate-x-full' : 
            'transform translate-x-0'
          }`}
        >
          {visibleDays.map((day, dayIndex) => (
            <div key={dayIndex} className="flex flex-col w-full">
              {/* Gün Başlığı */}
              <div className="text-center mb-3 p-2 bg-gray-50 rounded-lg w-full">
                <div className="text-sm font-medium">
                  {day.isToday ? 'Bugün' : day.isTomorrow ? 'Yarın' : day.shortName}
                </div>
                <div className="text-xs text-gray-600">
                  {day.date} {day.month}
                </div>
              </div>
              
              {/* Saatler */}
              <div className="flex flex-col gap-2 w-full">
                {day.times.map((time, timeIndex) => (
                  <div 
                    key={timeIndex}
                    className="text-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors w-full"
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppointmentTimes;