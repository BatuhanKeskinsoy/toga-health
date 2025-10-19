import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const success = params.success;
  const token = params.token;
  const code = params.code;
  const state = params.state;

  // Yeni callback formatı (success, token, message parametreleri ile)
  if (success === 'true' && token && typeof token === 'string') {
    try {
      // Server-side cookie set etme
      const cookieStore = await cookies();
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 gün
        path: '/',
      });

      // Ana sayfaya yönlendir
      redirect('/');
    } catch (error) {
      console.error('Token kaydetme hatası:', error);
      // Hata durumunda da ana sayfaya yönlendir
      redirect('/');
    }
  }

  // Eski callback formatı (code ve state parametreleri ile)
  if (code && state && typeof code === 'string' && typeof state === 'string') {
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
      
      if (data.success && data.token) {
        // Server-side cookie set etme
        const cookieStore = await cookies();
        cookieStore.set('auth-token', data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 gün
          path: '/',
        });

        // Ana sayfaya yönlendir
        redirect('/');
      } else {
        // Başarısız durumda ana sayfaya yönlendir
        redirect('/');
      }
    } catch (error) {
      console.error('Callback error:', error);
      // Hata durumunda ana sayfaya yönlendir
      redirect('/');
    }
  }

  // Geçersiz parametreler durumunda ana sayfaya yönlendir
  redirect('/');
}

