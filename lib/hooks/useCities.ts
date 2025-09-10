import { useState, useEffect } from 'react';
import { getCities } from '@/lib/services/locations';
import { City } from '@/lib/types/locations/locationsTypes';

// Cookie işlemleri için yardımcı fonksiyonlar
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const useCities = (countrySlug: string | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      // Cookie'den location kontrolü
      const countryCookie = getCookie('selected_country');
      
      // Eğer cookie'de location varsa ve countrySlug null ise, cookie'den al
      let targetCountrySlug = countrySlug;
      if (!targetCountrySlug && countryCookie) {
        try {
          const countryData = JSON.parse(countryCookie);
          targetCountrySlug = countryData.slug;
        } catch (err) {
          // Cookie parse edilemezse boş bırak
        }
      }
      
      if (!targetCountrySlug) {
        setCities([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await getCities(targetCountrySlug);
        setCities(data.cities || []);
      } catch (err: any) {
        setError(err.message || 'Şehirler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [countrySlug]);

  return { cities, loading, error };
}; 