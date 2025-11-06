"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomInput from "@/components/Customs/CustomInput";
import CustomButton from "@/components/Customs/CustomButton";
import CustomSelect from "@/components/Customs/CustomSelect";
import { createAppointment } from "@/lib/services/appointment/services";
import type { CreateAppointmentRequest } from "@/lib/types/appointments/provider";
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import { useLocale, useTranslations } from "next-intl";
import { convertDateOnly } from "@/lib/functions/getConvertDate";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedDate?: Date;
  selectedTime?: string; // HH:MM formatında saat
  selectedAddressId?: string | null;
  addresses?: Array<{ address_id: string; is_default?: boolean }>;
  providerId: number;
  providerType: "doctor" | "corporate";
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedDate,
  selectedTime,
  selectedAddressId,
  addresses = [],
  providerId,
  providerType,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  // Form data - tarih ve adres otomatik olarak ayarlanacak
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Adres ID'sini belirle - prop'tan geliyorsa onu kullan, yoksa addresses array'inden varsayılan adresi al
  const finalAddressId = useMemo(() => {
    if (selectedAddressId) {
      return selectedAddressId;
    }
    const defaultAddress = addresses.find((addr) => addr.is_default);
    if (defaultAddress?.address_id) {
      return defaultAddress.address_id;
    }
    if (addresses[0]?.address_id) {
      return addresses[0].address_id;
    }
    return null;
  }, [selectedAddressId, addresses]);

  // Modal açıldığında tarih ve adres bilgilerini güncelle
  useEffect(() => {
    if (isOpen) {
      // Eğer seçili saat varsa onu kullan, yoksa boş bırak
      setAppointmentTime(selectedTime || "");
      setAppointmentType("consultation");
      setNotes("");
    }
  }, [isOpen, selectedTime]);

  const handleSubmit = useCallback(async () => {
    // Validation - Sadece saat kontrolü (tarih ve adres zaten seçili)
    if (!appointmentTime || appointmentTime.trim().length === 0) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: "Lütfen saat seçiniz.",
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    // Tarih kontrolü - eğer yoksa bu bir hata durumu
    if (!selectedDate) {
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: t("Tarih seçilmedi, lütfen takvimden bir gün seçin"),
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    // Adres ID'sini tekrar hesapla (güncel değeri garantilemek için)
    const addressId = selectedAddressId || 
      addresses.find((addr) => addr.is_default)?.address_id || 
      addresses[0]?.address_id || 
      null;

    if (!addressId) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: "Adres seçilmedi. Lütfen bir adres seçin.",
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    // Form data'yı oluştur
    // address_id string olabilir (addr-xxx) veya number, direkt gönder
    const formData: CreateAppointmentRequest = {
      bookable_type: providerType,
      bookable_id: providerId,
      appointment_date: selectedDate.toISOString().split("T")[0], // YYYY-MM-DD formatında
      appointment_time: appointmentTime.trim(),
      type: appointmentType,
      notes: notes.trim() || null,
      address_id: addressId, // String veya number olarak direkt gönder
    };

    setIsLoading(true);
    try {
      const response = await createAppointment(formData);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: t("Başarılı"),
          text: t("Randevu başarıyla oluşturuldu"),
          confirmButtonColor: "#ed1c24",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: error.response?.data?.message || t("Randevu oluşturulurken bir hata oluştu."),
        confirmButtonColor: "#ed1c24",
      });
    } finally {
      setIsLoading(false);
    }
  }, [appointmentTime, appointmentType, notes, selectedDate, selectedAddressId, addresses, providerType, providerId, onSuccess, onClose]);

  const typeOptions = [
    { id: 1, name: t("Danışmanlık"), value: "consultation" },
    { id: 2, name: t("Takip"), value: "followup" },
    { id: 3, name: t("Kontrol"), value: "checkup" },
  ];

  // Seçili tarih bilgisi
  const selectedDateStr = selectedDate ? convertDateOnly(selectedDate, locale) : "";

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <IoCalendarOutline className="text-sitePrimary text-xl" />
          <span>{t("Yeni Randevu Oluştur")}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tarih Bilgisi (Sadece gösterim) */}
        {selectedDateStr && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <IoCalendarOutline size={18} className="text-gray-600" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("Tarih")}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{selectedDateStr}</p>
          </div>
        )}

        {/* Time */}
        <CustomInput
          label={t("Saat")}
          type="time"
          value={appointmentTime || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            setAppointmentTime(newValue);
          }}
          required
          icon={<IoTimeOutline />}
        />

        {/* Type */}
        <CustomSelect
          id="type"
          name="type"
          label={t("Randevu Tipi")}
          value={typeOptions.find((opt) => opt.value === appointmentType) || null}
          options={typeOptions}
          onChange={(option) => setAppointmentType(option?.value || "consultation")}
          required
        />

        {/* Notes */}
        <CustomTextarea
          label={t("Notlar (Opsiyonel)")}
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton
            btnType="button"
            title={t("İptal")}
            handleClick={onClose}
            isDisabled={isLoading}
            containerStyles="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          />
          <CustomButton
            btnType="button"
            title={isLoading ? t("Yükleniyor") : t("Randevu Oluştur")}
            handleClick={handleSubmit}
            isDisabled={isLoading}
            containerStyles="px-6 py-2.5 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default React.memo(CreateAppointmentModal);

