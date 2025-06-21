"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleRefresh = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch("/api/refresh-locales", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "API hatası");
        }

        if (!data.success) {
          throw new Error(data.error || "İşlem başarısız");
        }

        console.log("✅ Locale dosyaları güncellendi:", data.message);
        router.push("/en");
      } catch (err) {
        console.error("Refresh hatası:", err);
        setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      } finally {
        setIsLoading(false);
      }
    };

    handleRefresh();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Locale dosyaları güncelleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Hata</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push("/en")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return null;
}
