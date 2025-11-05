"use client";
import React, { useState, useMemo } from "react";
import WeekNavigator from "@/components/(front)/Provider/AppointmentTimes/WeekNavigator";
import WeekCalendar from "@/components/(front)/Provider/AppointmentTimes/WeekCalendar";
import { useAppointmentData } from "@/components/(front)/Provider/AppointmentTimes/hooks/useAppointmentData";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";
import { ProviderData } from "@/lib/types/provider/providerTypes";
import { Service } from "@/lib/types/appointments";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import {
  IoArrowBack,
  IoArrowDown,
  IoArrowForward,
  IoArrowUp,
  IoCalendar,
  IoCalendarClearOutline,
} from "react-icons/io5";
import { Link } from "@/i18n/navigation";
import TimeSlot from "@/components/(front)/Provider/AppointmentTimes/TimeSlot";

interface AppointmentTimesProps {
  onExpandedChange?: (expanded: boolean) => void;
  selectedAddressId?: string;
  selectedDoctorId?: number;
  isHospital?: boolean;
  doctorData?: ProviderData;
  selectedDoctor?: ProviderData;
  providerData?: ProviderData;
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
  selectedService?: Service | null;
  selectedAddress?: DoctorAddress | null; // Randevu oluşturma için kontrol
  onList?: boolean; // Liste görünümü için
}

function AppointmentTimes({
  onExpandedChange,
  selectedAddressId,
  selectedDoctorId,
  isHospital = false,
  doctorData,
  selectedDoctor,
  providerData,
  isExpanded,
  setIsExpanded,
  selectedService,
  selectedAddress,
  onList = false,
}: AppointmentTimesProps) {
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const t = useTranslations();
  const {
    currentWeek,
    loading,
    error,
    isDaysLimitError,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    resetToToday,
    currentPage,
  } = useAppointmentData(
    selectedAddressId,
    selectedDoctorId?.toString(),
    isHospital,
    doctorData as ProviderData,
    selectedDoctor,
    providerData,
    onList
  );

  const handleTimeSelect = (timeSlotId: string) => {
    setSelectedTime(timeSlotId);
  };

  // Randevu oluşturma butonunun aktif olup olmayacağını kontrol et
  const isAppointmentButtonEnabled = () => {
    // 1. Saat seçilmiş olmalı
    if (!selectedTime) return false;

    // 2. Hizmet seçilmiş olmalı
    if (!selectedService) return false;

    // 3. Doktor detay sayfasıysa: adres seçilmiş olmalı
    // 4. Hastane detay sayfasındaysa: doktor seçilmiş olmalı
    if (isHospital) {
      return !!selectedDoctor;
    } else {
      return !!(selectedAddress && selectedAddress.id);
    }
  };

  const handleToggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandedChange?.(newExpandedState);
  };

  const calculateContainerHeight = () => {
    // Liste görünümünde yüksekliği sınırlandır
    if (onList) {
      return "max-h-[400px] overflow-y-auto";
    }

    if (!isExpanded) {
      return "lg:h-[280px] h-[320px]";
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

  // Liste görünümünde tek günlük takvim için gün seç
  const currentDay = useMemo(() => {
    if (!onList || currentWeek.length === 0) return null;
    // currentPage'e göre gün seç (0 = bugün, 1 = yarın, vs.)
    return currentWeek[0] || null;
  }, [onList, currentWeek]);

  if (loading) {
    if (onList) {
      return (
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-2 animate-pulse">
            <div className="h-7 bg-gray-200 rounded"></div>
            <div className="flex gap-2 overflow-x-hidden pb-2">
              {[...Array(6)].map((_, j) => (
                <div
                  key={j}
                  className="flex items-center justify-center text-center text-xs font-medium h-7 rounded-md transition-all border bg-gray-200 border-dashed border-gray-300 text-gray-500 cursor-not-allowed opacity-50 min-w-[70px] px-3"
                />
              ))}
            </div>
          </div>
          <div className="h-1.5 bg-gray-200 rounded mt-1"></div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded"></div>
            <hr className="border-gray-200" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-7 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
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
      <div className="flex flex-col items-center justify-center gap-2 w-full text-center p-3 opacity-70 bg-gray-50 border border-gray-200 rounded-md">
        <IoCalendarClearOutline className="text-gray-600 text-xl" />
        <p className="text-gray-600 text-xs">
          {t("Henüz Randevu Alınabilecek Saat Bulunmuyor")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-w-0">
      {onList ? (
        // Liste görünümü: Tek günlük, saatler yan yana
        <>
          <div className="flex justify-between items-center mb-1 w-full min-w-0">
            <span className="text-xs font-medium">
              {currentDay?.isToday
                ? t("Bugün")
                : currentDay?.isTomorrow
                ? t("Yarın")
                : currentDay?.fullName || ""}
            </span>
            <div className="flex gap-1">
              <CustomButton
                leftIcon={<IoArrowBack size={12} />}
                handleClick={goToPreviousPage}
                containerStyles="flex items-center justify-center h-5 w-5 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                isDisabled={!hasPreviousPage}
              />
              <CustomButton
                rightIcon={<IoArrowForward size={12} />}
                handleClick={goToNextPage}
                containerStyles="flex items-center justify-center h-5 w-5 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                isDisabled={!hasNextPage}
              />
            </div>
          </div>
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-"
            style={{ scrollbarWidth: "thin" }}
          >
            {currentDay?.schedule?.timeSlots?.map((slot, index) => {
              const timeSlotId = `${currentDay.date}-${currentDay.month}-${slot.time}`;
              return (
                <TimeSlot
                  key={index}
                  time={slot.time}
                  isSelected={selectedTime === timeSlotId}
                  isAvailable={slot.isAvailable}
                  isBooked={slot.isBooked}
                  onClick={() => handleTimeSelect(timeSlotId)}
                />
              );
            }) || []}
          </div>
        </>
      ) : (
        // Normal görünüm: 4 günlük takvim
        <>
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
          {/* Liste görünümünde butonları gizle */}
          {!onList && (
            <>
              <hr className="border-gray-200 mt-2" />
              <div className="flex max-lg:flex-col gap-2 w-full">
                <CustomButton
                  containerStyles="flex justify-between items-center rounded-md w-full text-sm bg-gray-100 py-3 px-4 text-gray-500 mt-2 hover:bg-gray-200 transition-all duration-300"
                  title={
                    isExpanded
                      ? t("Saatleri Kısalt")
                      : t("Tüm Saatleri Görüntüle")
                  }
                  handleClick={handleToggleExpanded}
                  rightIcon={isExpanded ? <IoArrowUp /> : <IoArrowDown />}
                />
                {isAppointmentButtonEnabled() ? (
                  <Link
                    href={`/profile/appointments`}
                    className="flex justify-between items-center rounded-md w-full text-sm bg-sitePrimary py-3 px-4 text-white lg:mt-2 hover:bg-sitePrimary/80 transition-all duration-300"
                  >
                    {t("Randevu Oluştur")}
                    <IoArrowForward />
                  </Link>
                ) : (
                  <div className="flex justify-between items-center rounded-md w-full text-sm bg-sitePrimary py-3 px-4 text-white mt-2 transition-all duration-300 cursor-not-allowed opacity-50">
                    {t("Randevu Oluştur")}
                    <IoArrowForward />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AppointmentTimes;
