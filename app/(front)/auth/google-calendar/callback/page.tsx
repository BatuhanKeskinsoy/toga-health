"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function GoogleCalendarCallbackContent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const provider = searchParams.get("provider");

  useEffect(() => {
    if (code) {
      // Callback'i handle etmek için randevular sayfasına yönlendir
      // Component içinde handle edilecek
      const params = new URLSearchParams();
      params.set("code", code);
      params.set("provider", "google-calendar");
      
      // Randevular sayfasına yönlendir
      router.replace(`/profile/appointments?${params.toString()}`);
    } else {
      setError("Eksik parametreler");
      setIsProcessing(false);
    }
  }, [code, router]);

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

