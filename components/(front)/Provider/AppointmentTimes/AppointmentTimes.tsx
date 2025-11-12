"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import WeekNavigator from "@/components/(front)/Provider/AppointmentTimes/WeekNavigator";
import WeekCalendar from "@/components/(front)/Provider/AppointmentTimes/WeekCalendar";
import { useAppointmentData } from "@/components/(front)/Provider/AppointmentTimes/hooks/useAppointmentData";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";
import { ProviderData } from "@/lib/types/provider/providerTypes";
import { Service } from "@/lib/types/appointments";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import AppointmentBookingModal from "@/components/(front)/Provider/AppointmentTimes/AppointmentBookingModal";
import {
  IoArrowBack,
  IoArrowDown,
  IoArrowForward,
  IoArrowUp,
  IoCalendar,
  IoCalendarClearOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { Link } from "@/i18n/navigation";
import TimeSlot from "@/components/(front)/Provider/AppointmentTimes/TimeSlot";
import { useLocale } from "next-intl";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import type { SelectedSlotInfo } from "@/components/(front)/Provider/AppointmentTimes/DayCard";
import { useRouter } from "next/navigation";

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
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlotInfo | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
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
    appointmentData,
  } = useAppointmentData(
    selectedAddressId,
    selectedDoctorId?.toString(),
    isHospital,
    doctorData as ProviderData,
    selectedDoctor,
    providerData,
    onList
  );

  const handleTimeSelect = useCallback((slot: SelectedSlotInfo) => {
    setSelectedSlot(slot);
  }, []);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedService, selectedAddressId, selectedDoctorId]);

  const providerIdForBooking = useMemo(() => {
    if (isHospital) {
      if (selectedDoctorId && !Number.isNaN(Number(selectedDoctorId))) {
        return Number(selectedDoctorId);
      }
      const doctorIdentifier = (selectedDoctor as any)?.id;
      return doctorIdentifier && !Number.isNaN(Number(doctorIdentifier))
        ? Number(doctorIdentifier)
        : null;
    }

    const providerIdentifier = (providerData as any)?.id ?? (doctorData as any)?.id;
    return providerIdentifier && !Number.isNaN(Number(providerIdentifier))
      ? Number(providerIdentifier)
      : null;
  }, [
    isHospital,
    selectedDoctorId,
    selectedDoctor,
    providerData,
    doctorData,
  ]);

  const providerTypeForBooking = useMemo<"doctor" | "corporate">(() => {
    if (isHospital) {
      return "doctor";
    }

    const userType = (providerData as any)?.user_type ?? (doctorData as any)?.user_type;
    return userType === "corporate" ? "corporate" : "doctor";
  }, [isHospital, providerData, doctorData]);

  const canBookAppointment = useMemo(() => {
    if (!selectedSlot) return false;
    if (!selectedService) return false;
    if (!providerIdForBooking) return false;

    if (isHospital) {
      return Boolean(selectedDoctor);
    }

    return Boolean(selectedAddress?.id);
  }, [
    selectedSlot,
    selectedService,
    providerIdForBooking,
    isHospital,
    selectedDoctor,
    selectedAddress,
  ]);

  const addressIdForBooking = useMemo(() => {
    if (selectedAddress?.id) {
      return selectedAddress.id;
    }
    const addressFromData =
      appointmentData?.address?.address_id ??
      appointmentData?.address?.id?.toString?.();
    return addressFromData || null;
  }, [selectedAddress?.id, appointmentData?.address?.address_id, appointmentData?.address?.id]);

  const addressNameForBooking = useMemo(() => {
    if (selectedAddress?.name) {
      return selectedAddress.name;
    }
    return appointmentData?.address?.name ?? "";
  }, [selectedAddress?.name, appointmentData?.address?.name]);

  const handleOpenBookingModal = useCallback(() => {
    if (!canBookAppointment) {
      return;
    }
    setIsBookingModalOpen(true);
  }, [canBookAppointment]);

  const handleCloseBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  const handleBookingSuccess = useCallback(() => {
    setIsBookingModalOpen(false);
    setSelectedSlot(null);

    try {
      router.refresh();
    } catch (err) {
      // ignore refresh errors
    }

    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, [router]);

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

  // Tüm günler mesai dışı veya hiçbir saat yok mu kontrol et
  // Bu hook her zaman çağrılmalı (koşullu render'lardan önce)
  const hasNoAvailableSlots = useMemo(() => {
    if (currentWeek.length === 0) return false;
    
    // onList modunda sadece mevcut günü kontrol et
    const daysToCheck = onList ? currentWeek.slice(0, 1) : currentWeek;
    
    return daysToCheck.every((day) => {
      // Tatil günü ise ve hiç slot yoksa
      if (day.isHoliday) {
        const hasSlots =
          day.schedule?.timeSlots?.length > 0 ||
          day.allTimeSlots?.length > 0 ||
          day.times?.length > 0;
        return !hasSlots;
      }
      
      // Çalışma günü ise, müsait (rezerve olmayan) slot var mı kontrol et
      const availableSlots = day.schedule?.timeSlots?.filter(
        (slot) => slot.isAvailable && !slot.isBooked
      ) || [];
      
      const hasAvailableSlots =
        availableSlots.length > 0 ||
        (day.allTimeSlots?.some((slot) => slot.isAvailable && !slot.isBooked)) ||
        day.times?.length > 0; // times array'i varsa, müsait olduğunu varsayıyoruz
      
      return !hasAvailableSlots;
    });
  }, [currentWeek, onList]);

  if (loading) {
    if (onList) {
      return (
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-1 animate-pulse">
            <div className="flex items-start justify-center gap-1 w-full">
              <div className="h-10 w-full bg-gray-100 rounded"></div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 overflow-x-hidden">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-center text-center text-xs font-medium h-7 rounded-md transition-all border bg-gray-200 border-dashed border-gray-300 text-gray-500 cursor-not-allowed opacity-50 min-w-[50px] px-3"
                    />
                  ))}
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="h-0.5 w-full bg-gray-100 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8.5 w-full bg-gray-100 rounded mt-1"></div>
            <div className="h-8.5 w-full bg-gray-100 rounded mt-1"></div>
          </div>
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

  const firstDay = currentWeek[0];
  const currentMonth = firstDay?.month || "";
  const currentYear = new Date().getFullYear();

  // Hiçbir günde saat yoksa mesaj göster
  if (hasNoAvailableSlots) {
    // onList modunda navigation butonlarını göster
    if (onList && currentDay) {
      return (
        <div className="flex flex-col w-full min-w-0 gap-1.5">
          <div className="flex gap-2 w-full min-w-0">
            {/* Sol taraf: Bugün ve yön tuşları */}
            <div className="flex flex-col items-center justify-center bg-gray-100 gap-0 p-1 flex-shrink-0 min-w-0 rounded-md">
              <span className="text-[10px] font-medium whitespace-nowrap">
                {currentDay?.isToday
                  ? t("Bugün")
                  : currentDay?.isTomorrow
                  ? t("Yarın")
                  : currentDay?.fullName || ""}
              </span>
              <div className="flex gap-1">
                <CustomButton
                  leftIcon={<IoArrowBack size={10} />}
                  handleClick={goToPreviousPage}
                  containerStyles="flex items-center justify-center h-4 w-4 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                  isDisabled={!hasPreviousPage}
                />
                <CustomButton
                  rightIcon={<IoArrowForward size={10} />}
                  handleClick={goToNextPage}
                  containerStyles="flex items-center justify-center h-4 w-4 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                  isDisabled={!hasNextPage}
                />
              </div>
            </div>
            {/* Sağ taraf: Mesaj */}
            <div className="flex flex-col items-center justify-center gap-2 flex-1 min-w-0 text-center p-3 opacity-70 bg-gray-50 border border-gray-200 rounded-md">
              <IoCalendarClearOutline className="text-gray-600 text-xl" />
              <p className="text-gray-600 text-xs">
                {currentDay?.isHoliday 
                  ? t("Bu gün mesai dışı, lütfen başka bir gün seçin")
                  : t("Henüz Randevu Alınabilecek Saat Bulunmuyor")}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Normal modda sadece mesaj göster
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
    <div className="flex flex-col w-full min-w-0 gap-1.5">
      {onList ? (
        // Liste görünümü: Tek günlük, saatler yan yana
        <>
          <div
            className={`flex gap-2 w-full min-w-0 ${
              onList ? "justify-between items-center" : ""
            }`}
          >
            {/* Sol taraf: Bugün ve yön tuşları */}
            <div className="flex flex-col items-center justify-center bg-gray-100 gap-0 p-1 flex-shrink-0 min-w-0 rounded-md">
              <span className="text-[10px] font-medium whitespace-nowrap">
                {currentDay?.isToday
                  ? t("Bugün")
                  : currentDay?.isTomorrow
                  ? t("Yarın")
                  : currentDay?.fullName || ""}
              </span>
              <div className="flex gap-1">
                <CustomButton
                  leftIcon={<IoArrowBack size={10} />}
                  handleClick={goToPreviousPage}
                  containerStyles="flex items-center justify-center h-4 w-4 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                  isDisabled={!hasPreviousPage}
                />
                <CustomButton
                  rightIcon={<IoArrowForward size={10} />}
                  handleClick={goToNextPage}
                  containerStyles="flex items-center justify-center h-4 w-4 bg-gray-100 rounded-full enabled:hover:bg-sitePrimary/10 enabled:hover:text-sitePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                  isDisabled={!hasNextPage}
                />
              </div>
            </div>
            {/* Sağ taraf: Saatler */}
            <div
              className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0"
              style={{ scrollbarWidth: "thin" }}
            >
              {currentDay?.schedule?.timeSlots?.map((slot, index) => {
                const slotDate = currentDay.schedule?.date || "";
                const dayLabel = currentDay?.isToday
                  ? t("Bugün")
                  : currentDay?.isTomorrow
                  ? t("Yarın")
                  : currentDay?.fullName || "";
                const displayDate = `${currentDay?.date} ${currentDay?.month}`;
                const timeSlotId = `${slotDate}-${slot.time}`;

                return (
                  <TimeSlot
                    key={index}
                    time={slot.time}
                    isSelected={selectedSlot?.id === timeSlotId}
                    onList={onList}
                    isAvailable={slot.isAvailable}
                    isBooked={slot.isBooked}
                    onClick={() =>
                      handleTimeSelect({
                        id: timeSlotId,
                        date: slotDate,
                        time: slot.time,
                        dayLabel,
                        displayDate,
                      })
                    }
                  />
                );
              }) || []}
            </div>
          </div>
          <hr className="border-gray-100" />
          {/* Butonlar - Sadece saatler varsa göster */}
          {currentDay?.schedule?.timeSlots &&
            currentDay.schedule.timeSlots.length > 0 && (
              <div className="flex w-full gap-2">
                {/* Tüm Takvimi Göster Butonu */}
                {providerData && (
                  <Link
                    href={
                      isHospital
                        ? getLocalizedUrl("/hospital/[...slug]", locale, {
                            slug: [
                              (providerData as any).slug,
                              (providerData as any).location?.country_slug,
                              (providerData as any).location?.city_slug,
                            ].join("/"),
                          })
                        : getLocalizedUrl("/[...slug]", locale, {
                            slug: [
                              (providerData as any).slug,
                              (
                                providerData as any
                              ).doctor_info?.specialty?.translations?.find(
                                (t: any) => t.lang === locale
                              )?.slug ||
                                (providerData as any).doctor_info?.specialty
                                  ?.slug ||
                                "",
                              (providerData as any).location?.country_slug,
                              (providerData as any).location?.city_slug,
                            ]
                              .filter(Boolean)
                              .join("/"),
                          })
                    }
                    className="flex items-center justify-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 flex-1 hover:bg-sitePrimary hover:text-white transition-all duration-300"
                  >
                    <IoCalendarOutline size={16} />
                    <span className="text-xs">{t("Tüm Takvimi Göster")}</span>
                  </Link>
                )}
                {/* Randevu Al Butonu */}
                <button
                  type="button"
                  onClick={handleOpenBookingModal}
                  disabled={!canBookAppointment}
                  className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 flex-1 transition-all duration-300 ${
                    canBookAppointment
                      ? "bg-gray-100 text-gray-500 hover:bg-sitePrimary hover:text-white"
                      : "bg-gray-100 text-gray-500 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <IoCalendar size={16} />
                  <span className="text-xs">{t("Randevu Al")}</span>
                </button>
              </div>
            )}
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
              selectedTime={selectedSlot?.id}
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
                <button
                  type="button"
                  onClick={handleOpenBookingModal}
                  disabled={!canBookAppointment}
                  className={`flex justify-between items-center rounded-md w-full text-sm py-3 px-4 lg:mt-2 transition-all duration-300 ${
                    canBookAppointment
                      ? "bg-sitePrimary text-white hover:bg-sitePrimary/80"
                      : "bg-sitePrimary text-white opacity-50 cursor-not-allowed"
                  }`}
                >
                  {t("Randevu Oluştur")}
                  <IoArrowForward />
                </button>
              </div>
            </>
          )}
        </>
      )}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onSuccess={handleBookingSuccess}
        providerId={providerIdForBooking}
        providerType={providerTypeForBooking}
        addressId={addressIdForBooking}
        addressName={addressNameForBooking}
        service={selectedService || null}
        slot={selectedSlot}
      />
    </div>
  );
}

export default AppointmentTimes;
