'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setBearerToken } from '@/lib/axios';
import funcSweetAlert from '@/lib/functions/funcSweetAlert';

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        // Google OAuth callback parametreleri kontrolü
        if (code && state) {
          setStatus('processing');
          
          try {
            // Backend'e callback isteği gönder
            const response = await fetch('https://samsunev.com/api/v1/auth/social/google/callback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                code: code,
                state: state
              })
            });

            const data = await response.json();
            
            if (data.success && data.token && data.user) {
              // Token'ı set et ve kullanıcıyı giriş yaptır
              setBearerToken(data.token, true);

              // Cookie'nin güncellenmesi için kısa bir delay
              setTimeout(async () => {

                funcSweetAlert({
                  title: "Giriş Başarılı",
                  text: data.message || "Google ile başarıyla giriş yaptınız",
                  icon: "success",
                  confirmButtonText: "Tamam",
                  timer: 2000,
                  showConfirmButton: false,
                }).then(() => {
                  // Ana sayfaya yönlendir
                  router.push('/');
                });
              }, 200);

              setStatus('success');
            } else {
              setError(data.message || 'Giriş işlemi başarısız');
              setStatus('error');
            }
          } catch (err) {
            console.error('Callback error:', err);
            setError('Giriş işlemi sırasında bir hata oluştu');
            setStatus('error');
          }
          return;
        }
        
        // Hiçbir parametre yoksa hata
        setError('Geçersiz callback parametreleri');
        setStatus('error');
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Giriş işlemi sırasında bir hata oluştu');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Giriş işlemi tamamlanıyor...</p>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Hesap bilgileri alınıyor...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Başarılı!</h1>
          <p className="text-gray-600 mb-4">Ana sayfaya yönlendiriliyorsunuz...</p>
          <div className="animate-pulse text-blue-600">2 saniye sonra yönlendirileceksiniz</div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Başarısız</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    );
  }

  return null;
}
