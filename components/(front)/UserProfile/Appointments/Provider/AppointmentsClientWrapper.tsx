"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AppointmentCalendar,
  AppointmentStatistics,
  AppointmentDetailModal,
  CreateAppointmentModal,
  GoogleCalendarConnectButton,
} from "@/components/(front)/UserProfile/Appointments/Provider/index";
import CustomSelect from "@/components/Customs/CustomSelect";
import type {
  ProviderAppointmentsData,
  AppointmentStatistics as AppointmentStatisticsType,
  Appointment,
} from "@/lib/types/appointments/provider";
import type { Address } from "@/lib/types/user/addressesTypes";
import { IoLocationOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface AppointmentsClientWrapperProps {
  initialData: ProviderAppointmentsData;
  statistics: AppointmentStatisticsType;
  viewType?: "today" | "week" | "month" | "all";
  addresses?: Address[];
  selectedAddressId?: string | null;
  providerId?: number;
  providerType?: "doctor" | "corporate";
  googleCalendarConnected?: boolean;
  googleCalendarToken?: any;
}

const AppointmentsClientWrapper: React.FC<AppointmentsClientWrapperProps> = ({
  initialData,
  statistics: initialStatistics,
  viewType = "all",
  addresses = [],
  selectedAddressId: serverSelectedAddressId = null,
  providerId: propProviderId,
  providerType: propProviderType,
  googleCalendarConnected = false,
  googleCalendarToken = null,
}) => {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Server-side'dan gelen data'yı direkt kullan
  const appointmentsData = initialData;
  const statistics = initialStatistics;

  // Provider bilgilerini al - prop'tan geliyorsa onu kullan, yoksa provider_info'dan al
  const finalProviderId =
    propProviderId || appointmentsData.provider_info.provider_id;
  const finalProviderType =
    propProviderType || appointmentsData.provider_info.type;

  // URL'den address_id'yi al (client-side'da güncel değeri garantilemek için)
  const urlAddressId = searchParams.get("address_id");

  // Final selected address ID - URL'den gelen değeri öncelikle kullan
  const finalSelectedAddressId =
    urlAddressId ||
    serverSelectedAddressId ||
    (addresses.length > 0
      ? addresses.find((addr) => addr.is_default)?.address_id ||
        addresses[0]?.address_id
      : null);

  // Initial calendar view - viewType'a göre ayarla
  const initialCalendarView = useMemo(() => {
    switch (viewType) {
      case "today":
        return "timeGridDay" as const;
      case "week":
        return "timeGridWeek" as const;
      case "month":
        return "dayGridMonth" as const;
      default:
        return "dayGridMonth" as const;
    }
  }, [viewType]);

  // Appointment click handler - optimize edilmiş
  const handleAppointmentClick = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  }, []);

  // Date click handler - Yeni randevu oluşturma modalını açar
  const handleDateClick = useCallback((date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time || null);
    setIsCreateModalOpen(true);
  }, []);

  // Modal close handler
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  }, []);

  // Create modal close handler
  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setSelectedDate(null);
    setSelectedTime(null);
  }, []);

  // Modal update handler - Randevu güncellendiğinde sayfayı yenile
  const handleAppointmentUpdate = useCallback(() => {
    router.refresh();
  }, [router]);

  // Create success handler
  const handleCreateSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  // Address select handler - URL'i güncelle, server-side'da yeniden render olsun
  const handleAddressSelect = useCallback(
    (option: any) => {
      if (!option) return;

      const params = new URLSearchParams(searchParams.toString());

      // View parametresini koru
      if (viewType && viewType !== "all") {
        params.set("view", viewType);
      }

      // Address ID'yi güncelle
      if (option.value) {
        params.set("address_id", option.value);
      } else {
        params.delete("address_id");
      }

      // URL'i güncelle, bu da server-side'da yeniden render tetikleyecek
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, viewType]
  );

  // Adres seçenekleri
  const addressOptions = useMemo(() => {
    return addresses.map((address) => ({
      id: Number(address.address_id),
      name: `${address.name}${
        address.is_default ? ` (${t("Varsayılan")})` : ""
      }`,
      value: address.address_id,
    }));
  }, [addresses]);

  // Seçili adres objesi - server-side'dan gelen selectedAddressId'yi kullan
  const selectedAddress = useMemo(() => {
    return (
      addressOptions.find((opt) => opt.value === serverSelectedAddressId) ||
      null
    );
  }, [addressOptions, serverSelectedAddressId]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header ve Adres Seçimi */}
      <div className="bg-white rounded-md border border-gray-200 px-4 py-4 lg:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-gray-900">
              {t("Randevularım")}
            </h1>
            <p className="text-gray-600 text-xs">
              {t("Randevularınızı takvim görünümünde görüntüleyebilirsiniz")}
            </p>
          </div>

          {/* Adres Seçimi ve Google Calendar Butonu */}
          {addresses.length > 0 && (
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-3 lg:w-auto">
              <div className="lg:w-80 w-full">
                <CustomSelect
                  id="address-select"
                  name="address-select"
                  label={t("Adres Seçiniz")}
                  value={selectedAddress}
                  options={addressOptions}
                  onChange={handleAddressSelect}
                  icon={<IoLocationOutline />}
                  placeholder={t("Adres Seçiniz")}
                />
              </div>
              <div className="w-full lg:w-auto">
                <GoogleCalendarConnectButton
                  addressId={finalSelectedAddressId}
                  addressName={selectedAddress?.name}
                  isConnected={googleCalendarConnected}
                  onStatusChange={() => router.refresh()}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* İstatistikler */}
      <AppointmentStatistics statistics={statistics} />

      {/* İçerik - Server-side'dan gelen data direkt gösteriliyor */}
      <div className="w-full">
        <AppointmentCalendar
          appointments={appointmentsData.appointments}
          onEventClick={handleAppointmentClick}
          onDateClick={handleDateClick}
          initialView={initialCalendarView}
        />
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleAppointmentUpdate}
        />
      )}

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        selectedDate={selectedDate || undefined}
        selectedTime={selectedTime || undefined}
        selectedAddressId={finalSelectedAddressId}
        addresses={addresses}
        providerId={finalProviderId}
        providerType={finalProviderType}
      />
    </div>
  );
};

export default React.memo(AppointmentsClientWrapper);
