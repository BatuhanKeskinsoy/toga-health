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
    
    const { cookies } = require('next/headers');
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
    
    const { cookies } = require('next/headers');
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
    
    const { cookies } = require('next/headers');
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
      const { cookies } = require('next/headers');
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

// Provider filtreleri için cookie fonksiyonları
export async function getServerProviderFilters(): Promise<{
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
} | null> {
  try {
    // Bu fonksiyon sadece server-side'da kullanılmalı
    if (typeof window !== 'undefined') {
      console.warn('getServerProviderFilters sadece server-side\'da kullanılabilir');
      return null;
    }
    
    const { cookies } = require('next/headers');
    const cookieStore = await cookies();
    
    const sortByCookie = cookieStore.get('provider_sort_by')?.value;
    const sortOrderCookie = cookieStore.get('provider_sort_order')?.value;
    const providerTypeCookie = cookieStore.get('provider_type')?.value;
    
    return {
      sortBy: (sortByCookie as 'rating' | 'name' | 'created_at') || 'created_at',
      sortOrder: (sortOrderCookie as 'asc' | 'desc') || 'desc',
      providerType: providerTypeCookie as 'corporate' | 'doctor' | null || null
    };
  } catch (error) {
    console.error('Server provider filters alma hatası:', error);
    return null;
  }
}

export async function setServerProviderFilters(filters: {
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
}): Promise<void> {
  try {
    // Bu fonksiyon sadece server-side'da kullanılmalı
    if (typeof window !== 'undefined') {
      console.warn('setServerProviderFilters sadece server-side\'da kullanılabilir');
      return;
    }
    
    const { cookies } = require('next/headers');
    const cookieStore = await cookies();
    
    cookieStore.set('provider_sort_by', filters.sortBy, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 gün
      path: '/'
    });
    
    cookieStore.set('provider_sort_order', filters.sortOrder, { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 gün
      path: '/'
    });
    
    if (filters.providerType) {
      cookieStore.set('provider_type', filters.providerType, { 
        httpOnly: false, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 gün
        path: '/'
      });
    } else {
      cookieStore.delete('provider_type');
    }
  } catch (error) {
    console.error('Server provider filters kaydetme hatası:', error);
  }
}

// Location cookie'leri için server-side fonksiyonlar
export async function getServerLocation(): Promise<{
  country: { id: number; name: string; slug: string } | null;
  city: { id: number; name: string; slug: string; countrySlug: string } | null;
  district: { id: number; name: string; slug: string; citySlug: string } | null;
} | null> {
  try {
    // Bu fonksiyon sadece server-side'da kullanılmalı
    if (typeof window !== 'undefined') {
      console.warn('getServerLocation sadece server-side\'da kullanılabilir');
      return null;
    }
    
    const { cookies } = require('next/headers');
    const cookieStore = await cookies();
    
    const countryCookie = cookieStore.get('selected_country')?.value;
    const cityCookie = cookieStore.get('selected_city')?.value;
    const districtCookie = cookieStore.get('selected_district')?.value;
    
    if (countryCookie && cityCookie) {
      try {
        // Cookie'leri decode et
        const decodedCountryCookie = decodeURIComponent(countryCookie);
        const decodedCityCookie = decodeURIComponent(cityCookie);
        const decodedDistrictCookie = districtCookie ? decodeURIComponent(districtCookie) : null;
        
        const country = JSON.parse(decodedCountryCookie);
        const city = JSON.parse(decodedCityCookie);
        const district = decodedDistrictCookie ? JSON.parse(decodedDistrictCookie) : null;
        
        return {
          country,
          city,
          district: district || { id: 0, name: "", slug: "", citySlug: "" }
        };
      } catch (err) {
        console.error('Location cookie parse hatası:', err);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Server location alma hatası:', error);
    return null;
  }
}

// Location cookie'leri için universal fonksiyon (hem server hem client için)
export async function getLocation(): Promise<{
  country: { id: number; name: string; slug: string } | null;
  city: { id: number; name: string; slug: string; countrySlug: string } | null;
  district: { id: number; name: string; slug: string; citySlug: string } | null;
} | null> {
  // Server-side'da
  if (typeof window === 'undefined') {
    return await getServerLocation();
  }
  
  // Client-side'da
  try {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    
    const countryCookie = getCookie('selected_country');
    const cityCookie = getCookie('selected_city');
    const districtCookie = getCookie('selected_district');
    
    if (countryCookie && cityCookie) {
      try {
        // Cookie'leri decode et
        const decodedCountryCookie = decodeURIComponent(countryCookie);
        const decodedCityCookie = decodeURIComponent(cityCookie);
        const decodedDistrictCookie = districtCookie ? decodeURIComponent(districtCookie) : null;
        
        const country = JSON.parse(decodedCountryCookie);
        const city = JSON.parse(decodedCityCookie);
        const district = decodedDistrictCookie ? JSON.parse(decodedDistrictCookie) : null;
        
        return {
          country,
          city,
          district: district || { id: 0, name: "", slug: "", citySlug: "" }
        };
      } catch (err) {
        console.error('Location cookie parse hatası:', err);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Client location alma hatası:', error);
    return null;
  }
}