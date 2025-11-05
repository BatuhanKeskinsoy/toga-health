"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppointmentCalendar from "./AppointmentCalendar";
import AppointmentStatistics from "./AppointmentStatistics";
import AppointmentDetailModal from "./AppointmentDetailModal";
import CustomSelect from "@/components/Customs/CustomSelect";
import type {
  ProviderAppointmentsData,
  AppointmentStatistics as AppointmentStatisticsType,
  Appointment,
} from "@/lib/types/appointments/provider";
import type { Address } from "@/lib/types/user/addressesTypes";
import { IoLocationOutline } from "react-icons/io5";

interface AppointmentsClientWrapperProps {
  initialData: ProviderAppointmentsData;
  statistics: AppointmentStatisticsType;
  viewType?: "today" | "week" | "month" | "all";
  addresses?: Address[];
  selectedAddressId?: string | null;
}

const AppointmentsClientWrapper: React.FC<AppointmentsClientWrapperProps> = ({
  initialData,
  statistics: initialStatistics,
  viewType = "all",
  addresses = [],
  selectedAddressId: serverSelectedAddressId = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Server-side'dan gelen data'yı direkt kullan
  const appointmentsData = initialData;
  const statistics = initialStatistics;

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

  // Modal close handler
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  }, []);

  // Address select handler - URL'i güncelle, server-side'da yeniden render olsun
  const handleAddressSelect = useCallback((option: any) => {
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
  }, [router, searchParams, viewType]);

  // Adres seçenekleri
  const addressOptions = useMemo(() => {
    return addresses.map((address) => ({
      id: Number(address.address_id),
      name: `${address.name}${address.is_default ? " (Varsayılan)" : ""}`,
      value: address.address_id,
    }));
  }, [addresses]);

  // Seçili adres objesi - server-side'dan gelen selectedAddressId'yi kullan
  const selectedAddress = useMemo(() => {
    return addressOptions.find((opt) => opt.value === serverSelectedAddressId) || null;
  }, [addressOptions, serverSelectedAddressId]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header ve Adres Seçimi */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4 lg:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-gray-900">
              Randevularım
            </h1>
            <p className="text-gray-600 text-xs">
              Randevularınızı takvim görünümünde görüntüleyebilirsiniz.
            </p>
          </div>

          {/* Adres Seçimi */}
          {addresses.length > 0 && (
            <div className="lg:w-80">
              <CustomSelect
                id="address-select"
                name="address-select"
                label="Adres Seçiniz"
                value={selectedAddress}
                options={addressOptions}
                onChange={handleAddressSelect}
                icon={<IoLocationOutline />}
                placeholder="Adres seçiniz"
              />
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
          initialView={initialCalendarView}
        />
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default React.memo(AppointmentsClientWrapper);
