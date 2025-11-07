"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleCalendarSyncService } from "@/lib/services/auth/googleAuth";
import Swal from "sweetalert2";

function GoogleCalendarCallbackContent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");
    const oauthErrorDescription = searchParams.get("error_description");

    if (oauthError) {
      const message = oauthErrorDescription
        ? decodeURIComponent(oauthErrorDescription)
        : oauthError;
      setError(message || "Google Calendar bağlantısı başarısız");
      setIsProcessing(false);
      return;
    }

    if (!code) {
      setError("Eksik parametreler");
      setIsProcessing(false);
      return;
    }

    const syncCalendar = async () => {
      try {
        await googleCalendarSyncService(code);
        Swal.fire({
          icon: "success",
          title: "Başarılı",
          text: "Google Calendar bağlantısı tamamlandı",
          confirmButtonColor: "#ed1c24",
          timer: 2000,
          timerProgressBar: true,
        });
        router.replace("/profile/appointments");
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || "Google Calendar bağlantısı başarısız";
        setError(message);
        setIsProcessing(false);
      }
    };

    syncCalendar();
  }, [router, searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sitePrimary mx-auto mb-4"></div>
          <p className="text-gray-600">Google Calendar bağlantısı işleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function GoogleCalendarCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sitePrimary mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      }
    >
      <GoogleCalendarCallbackContent />
    </Suspense>
  );
}

