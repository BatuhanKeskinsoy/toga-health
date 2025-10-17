'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authWithGoogleCallback, getUserData } from '@/app/services/auth';
import { setSafeUserData } from '@/app/utils/cookieUtils';
import { useAuthStore } from '@/app/store/authStore';

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
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const token = searchParams.get('token');
        const success = searchParams.get('success');
        const message = searchParams.get('message');
        const provider = searchParams.get('provider') || 'google';
        
        // Direct token callback (Google ile giriş sonrası)
        if (token && success === 'true') {
          setStatus('processing');
          
          try {
            // Token ile kullanıcı bilgilerini al
            const userData = await getUserData(token);
            const user = userData.user || userData;
            
            // Token ve kullanıcı bilgilerini kaydet
            setSafeUserData(user, token);
            setUser({ user, token });
            setStatus('success');
            
            // 2 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
              router.push('/');
            }, 2000);
          } catch (err) {
            console.error('Token callback error:', err);
            setError('Kullanıcı bilgileri alınamadı');
            setStatus('error');
          }
          return;
        }
        
        // OAuth code callback (eski sistem)
        if (code) {
          setStatus('processing');
          
          const response = await authWithGoogleCallback(code);

          if (response.success && response.user) {
            // Kullanıcı bilgilerini store'a kaydet
            setUser(response.user);
            setStatus('success');
            
            // 3 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
              router.push('/');
            }, 3000);
          } else {
            setError(response.message || 'Giriş işlemi başarısız');
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
  }, [searchParams, setUser, router]);

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
