"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthCallbackContent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const success = searchParams.get("success");
  const token = searchParams.get("token");
  const message = searchParams.get("message");

  useEffect(() => {
    const handleCallback = () => {
      if (token && typeof token === "string") {
        try {
          // Direkt client-side cookie set et
          document.cookie = `auth-token=${token}; path=/; max-age=${
            60 * 60 * 24 * 7
          }; samesite=lax`;

          // Anlık yönlendirme
          router.push("/");
        } catch (err) {
          console.error("Cookie set etme hatası:", err);
          setError(err instanceof Error ? err.message : String(err));
          setIsProcessing(false);
        }
      } else {
        setError("Token bulunamadı");
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [token, router]);

  // Çok kısa loading sadece
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

  // Hata durumu
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-40 h-40 bg-red-100 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <svg
              className="w-20 h-20 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            {error.includes("Token bulunamadı")
              ? "Token Bulunamadı"
              : "Giriş Hatası"}
          </h1>
          <p className="text-gray-600 text-2xl">
            {error.includes("Token bulunamadı")
              ? "URL'de token parametresi bulunamadı"
              : "Giriş işlemi sırasında bir hata oluştu"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl shadow-2xl p-8 mb-8 border-2 border-gray-200">
          <h3 className="font-bold text-2xl text-gray-900 mb-8 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-sitePrimary mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Debug Bilgileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl">
                <span className="font-bold text-gray-700">Success:</span>
                <span className="text-gray-900 font-mono text-lg">
                  {success || "Yok"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl">
                <span className="font-bold text-gray-700">Token:</span>
                <span className="text-gray-900 font-mono text-sm">
                  {token && typeof token === "string"
                    ? token.substring(0, 25) + "..."
                    : "Yok"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl">
                <span className="font-bold text-gray-700">Cookie Set:</span>
                <span className="text-green-600 font-bold text-xl">✅</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl">
                <span className="font-bold text-gray-700">Message:</span>
                <span className="text-gray-900 text-lg">
                  {message || "Yok"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl">
                <span className="font-bold text-gray-700">Format:</span>
                <span className="text-gray-900 text-lg">Facebook OAuth</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl">
                <span className="font-bold text-gray-700">Status:</span>
                <span className="text-red-600 font-bold text-xl">Hata</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-red-200">
            <div className="flex items-start">
              <svg
                className="w-8 h-8 text-red-500 mt-1 mr-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-red-800 font-bold text-xl mb-3">
                  Hata Detayı:
                </p>
                <p className="text-red-700 text-lg">{error}</p>
              </div>
            </div>
          </div>

          {debugInfo && (
            <div className="mt-8 p-6 bg-gray-100 rounded-2xl">
              <p className="text-gray-800 font-bold text-xl mb-4">
                API Response:
              </p>
              <pre className="text-sm text-gray-700 overflow-auto bg-white p-4 rounded-xl border-2">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-12 py-6 bg-sitePrimary text-white font-bold text-xl rounded-2xl hover:bg-sitePrimary/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
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
      <AuthCallbackContent />
    </Suspense>
  );
}
