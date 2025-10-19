'use server';

import { cookies } from 'next/headers';

export async function setTokenAction(token: string) {
  try {
    if (!token) {
      return { success: false, error: 'Token gerekli' };
    }

    // Server-side cookie set etme
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    });

    return { 
      success: true, 
      message: 'Token başarıyla kaydedildi' 
    };
  } catch (error) {
    console.error('Token kaydetme hatası:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
    };
  }
}
