"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleCalendarSaveTokenService, googleCalendarSyncService } from "@/lib/services/calendar/googleCalendar";

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
      console.error("[GoogleCalendar][Callback] OAuth hata parametresi", {
        oauthError,
        oauthErrorDescription,
      });
      const message = oauthErrorDescription
        ? decodeURIComponent(oauthErrorDescription)
        : oauthError;
      setError(message || "Google Calendar bağlantısı başarısız");
      setIsProcessing(false);
      return;
    }

    if (!code) {
      console.error("[GoogleCalendar][Callback] Code parametresi eksik");
      setError("Eksik parametreler");
      setIsProcessing(false);
      return;
    }

    const saveToken = async () => {
      try {
        console.info("[GoogleCalendar][Callback] Token kaydetme süreci başladı", {
          codeLength: code.length,
        });
        await googleCalendarSaveTokenService(code);
        console.info("[GoogleCalendar][Callback] Token kaydetme başarılı");
      } catch (err: any) {
        console.error("[GoogleCalendar][Callback] Token kaydetme hatası", err);
        const message =
          err?.response?.data?.message || err?.message || "Google Calendar bağlantısı başarısız";
        setError(message);
        setIsProcessing(false);
      }
    };

    const syncCalendar = async () => {
      try {
        console.info("[GoogleCalendar][Callback] Senkronizasyon süreci başladı");
        await googleCalendarSyncService(code);
        console.info("[GoogleCalendar][Callback] Senkronizasyon başarılı, randevulara yönlendiriliyor");
        router.replace("/profile/appointments");
      } catch (err: any) {
        console.error("[GoogleCalendar][Callback] Senkronizasyon hatası", err);
        const message =
          err?.response?.data?.message || err?.message || "Google Calendar bağlantısı başarısız";
        setError(message);
        setIsProcessing(false);
      }
    };
    saveToken();
    syncCalendar();
  }, [router, searchParams]);

  

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative mb-8">
            {/* Ana spinner */}
            <div className="w-32 h-32 mx-auto">
              <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="w-full h-full border-4 border-sitePrimary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>

            {/* İç daire */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 border-2 border-gray-200 rounded-full"></div>
              <div
                className="w-16 h-16 border-2 border-sitePrimary border-b-transparent rounded-full animate-spin absolute top-0 left-0"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "0.8s",
                }}
              ></div>
            </div>

            {/* Merkez nokta */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-sitePrimary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("[GoogleCalendar][Callback] Kullanıcıya gösterilen hata", error);
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
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="relative mb-8">
              {/* Ana spinner */}
              <div className="w-32 h-32 mx-auto">
                <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="w-full h-full border-4 border-sitePrimary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>

              {/* İç daire */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 border-2 border-gray-200 rounded-full"></div>
                <div
                  className="w-16 h-16 border-2 border-sitePrimary border-b-transparent rounded-full animate-spin absolute top-0 left-0"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "0.8s",
                  }}
                ></div>
              </div>

              {/* Merkez nokta */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-sitePrimary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <GoogleCalendarCallbackContent />
    </Suspense>
  );
}

