"use client";
import React, { useRef, useState } from "react";
import { useGoogleCalendar } from "@/lib/hooks/calendar/useGoogleCalendar";
import { IoCalendarOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import CustomButton from "@/components/Customs/CustomButton";
import { googleCalendarDeleteTokenService } from "@/lib/services/calendar/googleCalendar";

interface GoogleCalendarConnectButtonProps {
  addressId: string | null;
  addressName?: string;
  isConnected?: boolean;
  isSyncing?: boolean;
  onStatusChange?: () => void;
}

const GoogleCalendarConnectButton: React.FC<GoogleCalendarConnectButtonProps> = ({
  addressId,
  addressName,
  isConnected = false,
  isSyncing = false,
  onStatusChange,
}) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const { handleGoogleCalendar } = useGoogleCalendar();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleConnect = async () => {
    if (!addressId) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: t("Adres seçilmedi"),
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    // SweetAlert2 ile onay al
    const result = await Swal.fire({
      icon: "question",
      title: t("Google Calendar'a Bağla"),
      html: `<p class="text-sm text-gray-600 mb-2">${t("Mevcutta seçili olan adrese Google Calendar takvimi entegre edilecektir.")}</p><p class="text-sm font-semibold text-gray-900">${addressName || t("Seçili Adres")}</p><p class="text-sm text-gray-600 mt-2">${t("Onaylıyor musunuz?")}</p>`,
      showCancelButton: true,
      confirmButtonText: t("Evet"),
      cancelButtonText: t("Hayır"),
      confirmButtonColor: "#ed1c24",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await handleGoogleCalendar();
      } catch (error: any) {
        console.error("Google Calendar auth error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDisconnect = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: t("Google Calendar bağlantısını kaldır"),
      text: t("Google Calendar hesabınızın bağlantısını kaldırmak istediğinize emin misiniz?"),
      confirmButtonText: t("Evet"),
      cancelButtonText: t("Hayır"),
      showCancelButton: true,
      confirmButtonColor: "#ed1c24",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      await googleCalendarDeleteTokenService();
      Swal.fire({
        icon: "success",
        title: t("Başarılı"),
        text: t("Google Calendar bağlantısı kaldırıldı"),
        confirmButtonColor: "#ed1c24",
      });
      onStatusChange?.();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: error?.response?.data?.message || error?.message || t("Google Calendar bağlantısı kaldırılırken bir hata oluştu"),
        confirmButtonColor: "#ed1c24",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (isConnected) {
      void handleDisconnect();
    } else {
      void handleConnect();
    }
  };

  return (
    <div ref={containerRef}>
      <CustomButton
        btnType="button"
        title={
          isLoading || isSyncing
            ? t("Yükleniyor...")
            : isConnected
            ? t("Google Calendar bağlantısını kaldır")
            : t("Google Calendar'a Bağla")
        }
        handleClick={handleClick}
        isDisabled={isLoading || isSyncing || (!addressId && !isConnected)}
        containerStyles={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isConnected
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }`}
        leftIcon={<IoCalendarOutline size={18} />}
      />
    </div>
  );
};

export default GoogleCalendarConnectButton;

