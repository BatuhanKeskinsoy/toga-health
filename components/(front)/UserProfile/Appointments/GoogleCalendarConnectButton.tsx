"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGoogleCalendar } from "@/lib/hooks/calendar/useGoogleCalendar";
import { IoCalendarOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGoogleCalendarCallback } from "@/lib/services/calendar/googleCalendar";
import Swal from "sweetalert2";
import CustomButton from "@/components/Customs/CustomButton";

interface GoogleCalendarConnectButtonProps {
  addressId: string | null;
  addressName?: string;
}

const GoogleCalendarConnectButton: React.FC<GoogleCalendarConnectButtonProps> = ({
  addressId,
  addressName,
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { handleGoogleCalendar } = useGoogleCalendar();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleManualGoogleCalendar = async () => {
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

  useEffect(() => {
    const code = searchParams.get("code");
    const provider = searchParams.get("provider");
    if (!code || provider !== "google-calendar") return;

    const completeCallback = async () => {
      try {
        setIsLoading(true);
        const resp = await handleGoogleCalendarCallback(code);

        if (resp?.status) {
          Swal.fire({
            icon: "success",
            title: t("Başarılı"),
            text: t("Google Calendar başarıyla bağlandı"),
            confirmButtonColor: "#ed1c24",
          });
          // URL'den code ve provider parametrelerini temizle
          const params = new URLSearchParams(searchParams.toString());
          params.delete("code");
          params.delete("provider");
          router.replace(`/profile/appointments?${params.toString()}`, { scroll: false });
        } else {
          throw new Error(resp?.message || t("Google Calendar bağlantısı başarısız"));
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: t("Hata"),
          text: error.response?.data?.message || error.message || t("Google Calendar bağlantısı başarısız"),
          confirmButtonColor: "#ed1c24",
        });
      } finally {
        setIsLoading(false);
      }
    };

    completeCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef}>
      <CustomButton
        btnType="button"
        title={
          isLoading
            ? t("Yükleniyor...")
            : t("Google Calendar'a Bağla")
        }
        handleClick={handleManualGoogleCalendar}
        isDisabled={isLoading || !addressId}
        containerStyles="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        leftIcon={<IoCalendarOutline size={18} />}
      />
    </div>
  );
};

export default GoogleCalendarConnectButton;

