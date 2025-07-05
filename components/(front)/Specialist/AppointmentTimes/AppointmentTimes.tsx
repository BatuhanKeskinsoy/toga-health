"use client"
import CustomButton from "@/components/others/CustomButton";
import React, { useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

function AppointmentTimes() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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
    if (currentWeekIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentWeekIndex(currentWeekIndex - 1);
        setSlideDirection(null);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleNextWeek = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentWeekIndex(currentWeekIndex + 1);
        setSlideDirection(null);
        setIsAnimating(false);
      }, 300);
    }
  };

  const renderDays = (days: any[]) => (
    <div className="grid grid-cols-4 gap-4 w-full">
      {days.map((day, dayIndex) => (
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
            {day.times.map((time: string, timeIndex: number) => (
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
  );

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
            isDisabled={currentWeekIndex === 0 || isAnimating}
            containerStyles="h-10 w-10"
          />
          <CustomButton 
            rightIcon={<IoArrowForward />} 
            handleClick={handleNextWeek}
            isDisabled={isAnimating}
            containerStyles="h-10 w-10"
          />
        </div>
      </div>
      
      <hr className="border-gray-200" />
      
      {/* Günler ve Saatler Grid */}
      <div className="w-full overflow-hidden relative">
        {/* Mevcut Günler */}
        <div 
          className={`transition-transform transition-opacity transition-shadow duration-500 ease-in-out ${
            slideDirection === 'left' ? 'transform translate-x-full scale-90 opacity-0 shadow-none' : 
            slideDirection === 'right' ? 'transform -translate-x-full scale-90 opacity-0 shadow-none' : 
            'transform translate-x-0 scale-100 opacity-100 shadow-lg'
          }`}
        >
          {renderDays(visibleDays)}
        </div>
        
        {/* Yeni Günler (Animasyon sırasında görünür) */}
        {isAnimating && (
          <div 
            className="absolute top-0 left-0 w-full transition-transform transition-opacity transition-shadow duration-500 ease-in-out"
            style={{
              transform: slideDirection === 'left' ? 'translateX(-100%) scale(0.9)' : 
                        slideDirection === 'right' ? 'translateX(100%) scale(0.9)' : 
                        'translateX(0) scale(1)'
            ,
              opacity:  slideDirection ? 0 : 1,
              boxShadow: slideDirection ? 'none' : '0 10px 40px 0 rgba(0,0,0,0.10)'
            }}
          >
            {renderDays(generateWeekData(slideDirection === 'left' ? currentWeekIndex + 1 : currentWeekIndex - 1).slice(0, 4))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentTimes;