"use client";
import React, { useState } from "react";
import WeekNavigator from "@/components/(front)/Provider/AppointmentTimes/WeekNavigator";
import WeekCalendar from "@/components/(front)/Provider/AppointmentTimes/WeekCalendar";
import { useAppointmentData } from "@/components/(front)/Provider/AppointmentTimes/hooks/useAppointmentData";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";
import ServiceSelectionModal from "@/components/(front)/Provider/AppointmentTimes/ServiceSelectionModal";

import { ProviderData } from "@/lib/types/provider/providerTypes";
import { Service } from "@/lib/types/appointments";
import {
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from "react-icons/io5";

interface AppointmentTimesProps {
  onExpandedChange?: (expanded: boolean) => void;
  selectedAddressId?: string;
  selectedDoctorId?: number;
  isHospital?: boolean;
  doctorData?: ProviderData;
  selectedDoctor?: ProviderData;
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
}

function AppointmentTimes({
  onExpandedChange,
  selectedAddressId,
  selectedDoctorId,
  isHospital = false,
  doctorData,
  selectedDoctor,
  isExpanded,
  setIsExpanded,
}: AppointmentTimesProps) {
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const t = useTranslations();
  const {
    currentWeek,
    loading,
    error,
    isDaysLimitError,
    currentPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    resetToToday,
    appointmentData,
  } = useAppointmentData(
    selectedAddressId,
    selectedDoctorId?.toString(),
    isHospital,
    doctorData as ProviderData,
    selectedDoctor
  );

  // selectedAddressId yoksa loading göster
  if (!selectedAddressId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full text-center p-6 opacity-70 bg-gray-50 border border-gray-200 rounded-md">
        <IoLocationOutline className="text-gray-600 text-3xl" />
        <p className="text-gray-600 text-sm">
          {t("Henüz bir adres seçilmedi")}
        </p>
      </div>
    );
  }

  const handleTimeSelect = (timeSlotId: string) => {
    setSelectedTime(timeSlotId);

    // Servis verisi varsa servis seçim modalını aç
    if (
      appointmentData &&
      appointmentData.services &&
      appointmentData.services.length > 0
    ) {
      setIsServiceModalOpen(true);
    }
  };

  const handleServiceSelect = (service: Service) => {
    // Seçilen servis ile randevu oluşturma işlemi burada yapılacak
    console.log("Seçilen servis:", service);
    console.log("Seçilen saat:", selectedTime);
    // TODO: Randevu oluşturma API'sini çağır
  };

  const handleToggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandedChange?.(newExpandedState);
  };

  const calculateContainerHeight = () => {
    if (!isExpanded) {
      return "lg:h-[415px] h-[370px]";
    }

    const maxTimeSlots = Math.max(
      ...currentWeek.map(
        (day) =>
          day.schedule?.timeSlots?.length ||
          day.allTimeSlots?.length ||
          day.times.length ||
          0
      )
    );

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

  // Gün sayısı limiti hatası
  if (isDaysLimitError) {
    return (
      <div className="flex flex-col gap-4 w-full p-4 items-center justify-center text-center bg-orange-50 border border-orange-200 rounded-md">
        <p className="text-orange-600 text-base">
          {t("Gün sayısı en fazla 30 olabilir")}
        </p>
        <CustomButton
          containerStyles="flex justify-center items-center text-sm bg-sitePrimary py-3 px-6 text-white hover:bg-sitePrimary/80 transition-all duration-300 rounded-md"
          title={t("Günümüze Dön")}
          handleClick={resetToToday}
        />
      </div>
    );
  }

  // Diğer hatalar
  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t("Tekrar Dene")}
          </button>
        </div>
      </div>
    );
  }

  // Tüm günler mesai dışı veya hiçbir saat yok mu kontrol et
  const hasNoAvailableSlots =
    currentWeek.length > 0 &&
    currentWeek.every((day) => {
      const hasSlots =
        day.schedule?.timeSlots?.length > 0 ||
        day.allTimeSlots?.length > 0 ||
        day.times?.length > 0;
      return day.isHoliday || !hasSlots;
    });

  const firstDay = currentWeek[0];
  const currentMonth = firstDay?.month || "";
  const currentYear = new Date().getFullYear();

  // Hiçbir günde saat yoksa mesaj göster
  if (hasNoAvailableSlots) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full text-center p-6 opacity-70 bg-gray-50 border border-gray-200 rounded-md">
        <IoCalendarClearOutline className="text-gray-600 text-3xl" />
        <p className="text-gray-600 text-sm">
          {t("Henüz Randevu Alınabilecek Saat Bulunmuyor")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex flex-col gap-2 transition-transform duration-300 ease-in-out ${calculateContainerHeight()}`}
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
        />
      </div>
      <hr className="border-gray-200 mt-2" />
      <CustomButton
        containerStyles="flex justify-center items-center text-sm bg-sitePrimary py-3 px-2 text-white mt-2 hover:bg-sitePrimary/80 transition-all duration-300"
        title={isExpanded ? t("Saatleri Kısalt") : t("Tüm Saatleri Görüntüle")}
        handleClick={handleToggleExpanded}
      />

      {/* Servis Seçim Modal */}
      {appointmentData &&
        appointmentData.services &&
        appointmentData.services.length > 0 && (
          <ServiceSelectionModal
            isOpen={isServiceModalOpen}
            onClose={() => setIsServiceModalOpen(false)}
            services={appointmentData.services}
            onServiceSelect={handleServiceSelect}
          />
        )}
    </div>
  );
}

export default AppointmentTimes;
