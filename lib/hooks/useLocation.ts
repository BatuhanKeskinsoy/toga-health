import { useState, useEffect } from 'react';
import { getLocation } from '@/lib/utils/cookies';

interface Location {
  country: {
    id: number;
    name: string;
    slug: string;
  };
  city: {
    id: number;
    name: string;
    slug: string;
    countrySlug: string;
  };
  district: {
    id: number;
    name: string;
    slug: string;
    citySlug: string;
  };
}

interface UseLocationOptions {
  initialLocation?: Location | null;
}

// Cookie işlemleri için yardımcı fonksiyonlar
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const useLocation = (options?: UseLocationOptions) => {
  const [location, setLocation] = useState<Location | null>(options?.initialLocation || null);
  const [loading, setLoading] = useState(!options?.initialLocation);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Eğer initialLocation verilmişse, client-side'da tekrar yükleme yapma
    if (options?.initialLocation !== undefined) {
      setLoading(false);
      return;
    }

    const loadLocationFromCookie = async () => {
      try {
        setLoading(true);
        
        // Universal getLocation fonksiyonunu kullan
        const locationData = await getLocation();
        setLocation(locationData);
        
      } catch (err) {
        console.error('Location yükleme hatası:', err);
        setLocation(null);
        setError('Location yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadLocationFromCookie();
  }, [options?.initialLocation]);

  // Konum güncelleme fonksiyonu
  const updateLocation = (newLocation: Location | null) => {
    setLocation(newLocation);
    
    if (newLocation) {
      // Cookie'ye kaydet (UTF-8 encode ile)
      setCookie('selected_country', encodeURIComponent(JSON.stringify(newLocation.country)));
      setCookie('selected_city', encodeURIComponent(JSON.stringify(newLocation.city)));
      if (newLocation.district && newLocation.district.id > 0) {
        setCookie('selected_district', encodeURIComponent(JSON.stringify(newLocation.district)));
      } else {
        setCookie('selected_district', '', -1);
      }
    } else {
      // Tüm cookie'leri temizle
      setCookie('selected_country', '', -1);
      setCookie('selected_city', '', -1);
      setCookie('selected_district', '', -1);
    }
  };

  return {
    location,
    loading,
    error,
    updateLocation
  };
}; 