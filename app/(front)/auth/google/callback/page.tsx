'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthCallback() {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Giriş tamamlanıyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Hata durumu
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {error.includes('Token bulunamadı') ? 'Token Bulunamadı' : 'Hata Oluştu'}
        </h1>
        <p className="text-gray-600 mb-4">
          {error.includes('Token bulunamadı') 
            ? 'URL\'de token parametresi bulunamadı' 
            : 'Bir hata oluştu'
          }
        </p>
        <div className="bg-red-100 p-4 rounded-lg text-left max-w-2xl">
          <h3 className="font-semibold mb-4 text-lg">
            🔍 Debug Bilgileri:
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Success:</strong> {success || "Yok"}
              </p>
              <p>
                <strong>Token:</strong> {token && typeof token === 'string' ? token.substring(0, 30) + "..." : "Yok"}
              </p>
              <p>
                <strong>Cookie Set:</strong> ✅
              </p>
            </div>
            <div>
              <p>
                <strong>Message:</strong> {message || "Yok"}
              </p>
              <p>
                <strong>Format:</strong> Google OAuth
              </p>
              <p>
                <strong>Status:</strong> Hata
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded">
            <p className="text-red-800 font-medium">❌ Hata Detayı:</p>
            <p className="text-red-700 text-sm mt-1">
              {error}
            </p>
          </div>
          {debugInfo && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <p className="text-gray-800 font-medium">📡 API Response:</p>
              <pre className="text-xs text-gray-700 mt-1 overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>
        <a
          href="/"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ana Sayfaya Git
        </a>
      </div>
    </div>
  );
}