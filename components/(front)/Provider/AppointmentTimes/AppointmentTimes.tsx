"use client";
import React, { useState } from "react";
import WeekNavigator from "@/components/(front)/Provider/AppointmentTimes/WeekNavigator";
import WeekCalendar from "@/components/(front)/Provider/AppointmentTimes/WeekCalendar";
import { useAppointmentData } from "@/components/(front)/Provider/AppointmentTimes/hooks/useAppointmentData";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";

import { ProviderData, isDoctorData } from "@/lib/types/provider/providerTypes";

interface AppointmentTimesProps {
  onExpandedChange?: (expanded: boolean) => void;
  selectedAddressId?: string;
  selectedDoctorId?: number;
  isHospital?: boolean;
  doctorData?: ProviderData;
  selectedDoctor?: ProviderData;
}

function AppointmentTimes({ onExpandedChange, selectedAddressId, selectedDoctorId, isHospital = false, doctorData, selectedDoctor }: AppointmentTimesProps) {
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations()
  const { 
    currentWeek, 
    loading, 
    error, 
    currentPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = useAppointmentData(selectedAddressId, selectedDoctorId?.toString(), isHospital, doctorData as ProviderData, selectedDoctor);

  // selectedAddressId yoksa loading göster
  if (!selectedAddressId) {
    return (
      <div className="flex flex-col gap-4 w-full p-4">
        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-500">{t('Lütfen Bir Adres Seçiniz')}</p>
        </div>
      </div>
    );
  }

  const handleTimeSelect = (timeSlotId: string) => {
    setSelectedTime(timeSlotId);
  };

  const handleToggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandedChange?.(newExpandedState);
  };

  const calculateContainerHeight = () => {
    if (!isExpanded) {
      return 'lg:h-[420px] h-[410px]';
    }
    
    const maxTimeSlots = Math.max(...currentWeek.map(day => 
      day.schedule?.timeSlots?.length || day.allTimeSlots?.length || day.times.length || 0
    ));
    
    const timeSlotHeight = 40;
    const gapHeight = 8; 
    const totalTimeHeight = maxTimeSlots * (timeSlotHeight + gapHeight);
    
    const extraHeight = 250; 
    const totalHeight = Math.max(totalTimeHeight + extraHeight, 600); 
    
    return `h-[${totalHeight}px]`;
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-16 bg-gray-200 rounded"></div>
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t('Tekrar Dene')}
          </button>
        </div>
      </div>
    );
  }

  // İlk günün ayını al
  const firstDay = currentWeek[0];
  const currentMonth = firstDay?.month || "";
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`flex flex-col gap-2 transition-all duration-500 ease-in-out ${calculateContainerHeight()}`}
      >
        <WeekNavigator
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPreviousWeek={goToPreviousPage}
          onNextWeek={goToNextPage}
          canGoPrevious={hasPreviousPage}
          canGoNext={hasNextPage}
        />

        <hr className="border-gray-200" />

        <WeekCalendar
          days={currentWeek}
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
          isExpanded={isExpanded}
        />
      </div>
      <hr className="border-gray-200" />
      <CustomButton
        containerStyles="flex justify-center items-center text-sm bg-sitePrimary py-3 px-2 text-white mt-2 hover:bg-sitePrimary/80 transition-all duration-300"
        title={isExpanded ? t('Saatleri Kısalt') : t('Tüm Saatleri Görüntüle')}
        handleClick={handleToggleExpanded}
      />
    </div>
  );
}

export default AppointmentTimes;