import { NextRequest } from 'next/server';

// Cookie ayarları
const COOKIE_CONFIG = {
  name: 'auth-token',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 gün
  path: '/',
};

// Server-side cookie işlemleri (sadece server-side'da kullanılabilir)
export async function getServerToken(): Promise<string | null> {
  try {
    // Bu fonksiyon sadece server-side'da kullanılmalı
    if (typeof window !== 'undefined') {
      console.warn('getServerToken sadece server-side\'da kullanılabilir');
      return null;
    }
    
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_CONFIG.name)?.value || null;
  } catch (error) {
    console.error('Server token alma hatası:', error);
    return null;
  }
}

export async function setServerToken(token: string): Promise<void> {
  try {
    // Bu fonksiyon sadece server-side'da kullanılmalı
    if (typeof window !== 'undefined') {
      console.warn('setServerToken sadece server-side\'da kullanılabilir');
      return;
    }
    
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_CONFIG.name, token, COOKIE_CONFIG);
  } catch (error) {
    console.error('Server token kaydetme hatası:', error);
  }
}

export async function deleteServerToken(): Promise<void> {
  try {
    // Bu fonksiyon sadece server-side'da kullanılmalı
    if (typeof window !== 'undefined') {
      console.warn('deleteServerToken sadece server-side\'da kullanılabilir');
      return;
    }
    
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_CONFIG.name);
  } catch (error) {
    console.error('Server token silme hatası:', error);
  }
}

// Universal token alma (hem server hem client için)
export async function getToken(): Promise<string | null> {
  // Server-side'da
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get(COOKIE_CONFIG.name)?.value || null;
    } catch (error) {
      console.error('Server token alma hatası:', error);
      return null;
    }
  }
  
  // Client-side'da
  try {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_CONFIG.name}=`))
      ?.split('=')[1];
    
    return cookieValue || null;
  } catch (error) {
    console.error('Client token alma hatası:', error);
    return null;
  }
}

// Client-side için sync versiyon (backward compatibility)
export function getClientToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_CONFIG.name}=`))
      ?.split('=')[1];
    
    return cookieValue || null;
  } catch (error) {
    console.error('Client token alma hatası:', error);
    return null;
  }
}

// Middleware için token alma
export function getMiddlewareToken(request: NextRequest): string | null {
  try {
    return request.cookies.get(COOKIE_CONFIG.name)?.value || null;
  } catch (error) {
    console.error('Middleware token alma hatası:', error);
    return null;
  }
}

// Client-side cookie set etme (login için)
export function setClientToken(token: string, rememberMe: boolean = false): void {
  if (typeof window === 'undefined') return;
  
  try {
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 gün veya 7 gün
    const secure = process.env.NODE_ENV === 'production' ? '; secure' : '';
    
    document.cookie = `${COOKIE_CONFIG.name}=${token}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
  } catch (error) {
    console.error('Client token kaydetme hatası:', error);
  }
}

// Client-side cookie silme (logout için)
export function deleteClientToken(): void {
  if (typeof window === 'undefined') return;
  
  try {
    document.cookie = `${COOKIE_CONFIG.name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (error) {
    console.error('Client token silme hatası:', error);
  }
}
