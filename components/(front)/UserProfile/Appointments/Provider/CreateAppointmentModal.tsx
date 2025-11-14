"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomInput from "@/components/Customs/CustomInput";
import CustomButton from "@/components/Customs/CustomButton";
import CustomSelect from "@/components/Customs/CustomSelect";
import { createAppointment } from "@/lib/services/appointment/provider";
import { useCurrencies } from "@/lib/hooks/globals/useCurrencies";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePhoneCodes } from "@/lib/hooks/globals/usePhoneCodes";
import type { CreateAppointmentRequest } from "@/lib/types/appointments/provider";
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoMailOutline, IoCallOutline, IoCashOutline } from "react-icons/io5";
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
  // Provider bilgisini al
  const { user: providerUser } = useUser();
  
  // Form data - tarih ve adres otomatik olarak ayarlanacak
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [locationType, setLocationType] = useState<"office" | "online" | "home">("office");
  const [timezone, setTimezone] = useState("Europe/Istanbul"); // Varsayılan timezone
  const [title, setTitle] = useState(""); // Manuel randevu için hasta adı (required)
  const [description, setDescription] = useState(""); // Açıklama
  const [phoneNumber, setPhoneNumber] = useState(""); // Telefon numarası
  const [phoneCode, setPhoneCode] = useState(""); // Telefon ülke kodu
  const [email, setEmail] = useState(""); // Email
  const [price, setPrice] = useState(""); // Fiyat
  const [currency, setCurrency] = useState("TRY"); // Para birimi
  const [isLoading, setIsLoading] = useState(false);
  
  // Para birimlerini API'den çek
  const { currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { phoneCodes, isLoading: phoneCodesLoading } = usePhoneCodes();

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

  const phoneCodeOptions = useMemo(
    () =>
      phoneCodes.map((code, index) => ({
        id: index + 1,
        name: code,
        value: code,
      })),
    [phoneCodes]
  );

  const formattedPhoneNumber = useMemo(() => {
    const trimmedNumber = phoneNumber.trim();
    if (!trimmedNumber) {
      return "";
    }
    const trimmedCode = (phoneCode || "").trim();
    return `${trimmedCode}${trimmedNumber}`;
  }, [phoneCode, phoneNumber]);

  // Modal açıldığında tarih ve adres bilgilerini güncelle
  useEffect(() => {
    if (isOpen) {
      // Eğer seçili saat varsa onu kullan, yoksa boş bırak
      setAppointmentTime(selectedTime || "");
      setAppointmentType("consultation");
      setLocationType("office");
      setTimezone("Europe/Istanbul");
      setTitle("");
      setDescription("");
      setPhoneNumber("");
      if (providerUser?.phone_code) {
        setPhoneCode(providerUser.phone_code);
      } else if (phoneCodeOptions.length > 0) {
        setPhoneCode((prev) => prev || phoneCodeOptions[0].value);
      } else {
        setPhoneCode("");
      }
      setEmail("");
      setPrice("");
      // Provider'ın default currency'sini kullan, yoksa API'den gelen varsayılan, yoksa TRY
      const providerCurrency = providerUser?.currency;
      const defaultCurrency = providerCurrency || 
        currencies.find((c) => c.is_default)?.code || 
        "TRY";
      setCurrency(defaultCurrency);
    }
  }, [
    isOpen,
    selectedTime,
    currencies,
    providerUser?.currency,
    providerUser?.phone_code,
    phoneCodeOptions,
  ]);

  const handleSubmit = useCallback(async () => {
    // Validation - Saat ve title kontrolü
    if (!appointmentTime || appointmentTime.trim().length === 0) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: t("Lütfen saat seçiniz."),
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    // Title required kontrolü
    if (!title || title.trim().length === 0) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: t("Lütfen hasta adını giriniz."),
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
    // Local tarih bilgisini kullanarak YYYY-MM-DD formatına çevir (timezone sorununu önlemek için)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const appointmentDateStr = `${year}-${month}-${day}`;
    
    const formData: CreateAppointmentRequest = {
      bookable_type: providerType,
      bookable_id: providerId,
      appointment_date: appointmentDateStr, // YYYY-MM-DD formatında (local timezone)
      appointment_time: appointmentTime.trim(),
      type: appointmentType as "consultation" | "checkup" | "surgery" | "followup" | "other",
      timezone: timezone,
      location_type: locationType,
      title: title.trim(), // Required
      address_id: addressId, // String veya number olarak direkt gönder
      ...(description.trim() && { description: description.trim() }),
      ...(formattedPhoneNumber && { phone_number: formattedPhoneNumber }),
      ...(email.trim() && { email: email.trim() }),
      ...(price.trim() && { price: parseFloat(price) }),
      ...(currency && { currency: currency }),
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
  }, [appointmentTime, appointmentType, locationType, timezone, title, description, email, price, currency, selectedDate, selectedAddressId, addresses, providerType, providerId, onSuccess, onClose, t, formattedPhoneNumber, phoneCode]);

  const typeOptions = [
    { id: 1, name: t("Danışmanlık"), value: "consultation" },
    { id: 2, name: t("Takip"), value: "followup" },
    { id: 3, name: t("Kontrol"), value: "checkup" },
    { id: 4, name: t("Ameliyat"), value: "surgery" },
    { id: 5, name: t("Diğer"), value: "other" },
  ];

  const locationTypeOptions = [
    { id: 1, name: t("Ofis"), value: "office" },
    { id: 2, name: "Online", value: "online" },
    { id: 3, name: t("Ev Ziyareti"), value: "home" },
  ];

  const currencyOptions = useMemo(() => {
    return currencies
      .filter((c) => c.is_active)
      .map((c) => ({
        id: c.id,
        name: `${c.code} - ${c.name}`,
        value: c.code,
      }));
  }, [currencies]);


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
        {/* Tarih Bilgisi (Full Width) */}
        {selectedDateStr && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <IoCalendarOutline size={18} className="text-gray-600" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("Tarih")}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{selectedDateStr}</p>
          </div>
        )}

        {/* Title and Time (Grid 2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label={t("Hasta Adı")}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
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
        </div>

        {/* Type and Location Type (Grid 2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            id="type"
            name="type"
            label={t("Randevu Tipi")}
            value={typeOptions.find((opt) => opt.value === appointmentType) || null}
            options={typeOptions}
            onChange={(option) => setAppointmentType(option?.value || "consultation")}
            required
          />
          <CustomSelect
            id="location_type"
            name="location_type"
            label={t("Konum Tipi")}
            value={locationTypeOptions.find((opt) => opt.value === locationType) || null}
            options={locationTypeOptions}
            onChange={(option) => setLocationType((option?.value as "office" | "online" | "home") || "office")}
            required
            icon={<IoLocationOutline />}
          />
        </div>

        {/* Phone Number and Email (Grid 2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(110px,0.35fr)_1fr]">
            <CustomSelect
              id="phone_code"
              name="phone_code"
              label={t("Ülke Kodu")}
              value={
                phoneCodeOptions.find((option) => option.value === phoneCode) || null
              }
              options={phoneCodeOptions}
              onChange={(option) => setPhoneCode(option?.value || "")}
              disabled={phoneCodesLoading}
              loading={phoneCodesLoading}
              required
              icon={<IoCallOutline />}
            />
            <CustomInput
              label={t("Telefon Numarası")}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              icon={<IoCallOutline />}
              required
              inputMode="tel"
            />
          </div>
          <CustomInput
            label={t("E-Posta")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<IoMailOutline />}
            required
          />
        </div>

        {/* Price and Currency (Grid 2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label={t("Fiyat (Opsiyonel)")}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            icon={<IoCashOutline />}
          />
          <CustomSelect
            id="currency"
            name="currency"
            label={t("Para Birimi")}
            value={currencyOptions.find((opt) => opt.value === currency) || null}
            options={currencyOptions}
            onChange={(option) => setCurrency(option?.value || "TRY")}
          />
        </div>

        {/* Description (Full Width) */}
        <CustomTextarea
          label={t("Açıklama (Opsiyonel)")}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

