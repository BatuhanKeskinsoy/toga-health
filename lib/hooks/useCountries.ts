import { useState, useEffect } from 'react';
import { getCountries } from '@/lib/services/locations';
import { Country } from '@/lib/types/locations/locationsTypes';

// Cookie işlemleri için yardımcı fonksiyonlar
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchCountries = async () => {
    // Eğer zaten yüklendiyse tekrar yükleme
    if (hasLoaded && countries.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getCountries();
      setCountries(data || []);
      setHasLoaded(true);
    } catch (err: any) {
      setError(err.message || 'Ülkeler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa ilk açıldığında sadece cookie'den location varsa yükle
  useEffect(() => {
    const countryCookie = getCookie('selected_country');
    const cityCookie = getCookie('selected_city');
    
    if (countryCookie || cityCookie) {
      fetchCountries();
    }
  }, []);

  return { countries, loading, error, fetchCountries };
}; 