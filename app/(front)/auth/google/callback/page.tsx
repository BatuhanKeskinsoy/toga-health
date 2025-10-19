'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthCallbackContent() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const success = searchParams.get('success');
  const token = searchParams.get('token');
  const message = searchParams.get('message');

  useEffect(() => {
    const handleCallback = () => {
      if (token && typeof token === "string") {
        try {
          // Direkt client-side cookie set et
          document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
          
          // Anlık yönlendirme
          router.push('/');
        } catch (err) {
          console.error('Cookie set etme hatası:', err);
          setError(err instanceof Error ? err.message : String(err));
          setIsProcessing(false);
        }
      } else {
        setError('Token bulunamadı');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [token, router]);

  // Çok kısa loading sadece
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sitePrimary/5 to-sitePrimary/10">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-sitePrimary rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-sitePrimary/20 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-xl font-semibold text-sitePrimary mb-2">Giriş Tamamlanıyor</h2>
          <p className="text-gray-600 text-sm">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {error.includes('Token bulunamadı') ? 'Token Bulunamadı' : 'Giriş Hatası'}
          </h1>
          <p className="text-gray-600 text-lg">
            {error.includes('Token bulunamadı') 
              ? 'URL\'de token parametresi bulunamadı' 
              : 'Giriş işlemi sırasında bir hata oluştu'
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-sitePrimary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Debug Bilgileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Success:</span>
                <span className="text-gray-900">{success || "Yok"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Token:</span>
                <span className="text-gray-900 font-mono text-xs">
                  {token && typeof token === 'string' ? token.substring(0, 20) + "..." : "Yok"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Cookie Set:</span>
                <span className="text-green-600 font-medium">✅</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Message:</span>
                <span className="text-gray-900">{message || "Yok"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Format:</span>
                <span className="text-gray-900">Google OAuth</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Status:</span>
                <span className="text-red-600 font-medium">Hata</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-800 font-medium mb-1">Hata Detayı:</p>
                <p className="text-red-700 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>

          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 font-medium mb-2">API Response:</p>
              <pre className="text-xs text-gray-700 overflow-auto bg-white p-3 rounded border">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sitePrimary text-white font-medium rounded-lg hover:bg-sitePrimary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sitePrimary/5 to-sitePrimary/10">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-sitePrimary rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-sitePrimary/20 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-xl font-semibold text-sitePrimary mb-2">Sayfa Yükleniyor</h2>
          <p className="text-gray-600 text-sm">Lütfen bekleyin...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}