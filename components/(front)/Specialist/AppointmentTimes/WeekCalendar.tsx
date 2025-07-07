"use client";
import React, { useState, useEffect } from "react";
import DayCard, { DayData } from "./DayCard";

interface WeekCalendarProps {
  days: DayData[];
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
  direction?: "left" | "right";
  isExpanded?: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  days,
  selectedTime,
  onTimeSelect,
  direction = "right",
  isExpanded = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setSlideDirection(direction);
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [direction, days]);

  const getSlideClasses = () => {
    const baseClasses = "transition-all duration-300 ease-out transform";
    
    if (isAnimating) {
      if (slideDirection === "left") {
        return `${baseClasses} translate-x-full opacity-0`;
      } else {
        return `${baseClasses} -translate-x-full opacity-0`;
      }
    }
    
    return `${baseClasses} translate-x-0 opacity-100`;
  };

  return (
    <div className={`w-full overflow-hidden relative transition-all duration-500 ease-in-out ${
      isExpanded ? 'h-auto' : 'lg:h-[440px] h-[410px]'
    }`}>
      <div 
        key={animationKey}
        className={getSlideClasses()}
      >
        <div className="grid grid-cols-4 gap-4 w-full">
          {days.map((day, dayIndex) => (
            <DayCard
              key={`${day.date}-${day.month}-${dayIndex}-${animationKey}`}
              day={day}
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
              animationDelay={dayIndex * 100}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar; 