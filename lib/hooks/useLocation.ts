import { useState, useEffect } from 'react';

interface Location {
  country: {
    id: number;
    name: string;
    code: string;
  };
  city: {
    id: number;
    name: string;
    countryId: number;
  };
  district: {
    id: number;
    name: string;
    cityId: number;
  };
}

// Cookie işlemleri için yardımcı fonksiyonlar
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocationFromCookie = () => {
      try {
        setLoading(true);
        
        // Cookie'den ülke, şehir ve ilçe bilgilerini al
        const countryCookie = getCookie('selected_country');
        const cityCookie = getCookie('selected_city');
        const districtCookie = getCookie('selected_district');
        
        if (countryCookie && cityCookie) {
          try {
            const country = JSON.parse(countryCookie);
            const city = JSON.parse(cityCookie);
            const district = districtCookie ? JSON.parse(districtCookie) : null;
            
            setLocation({
              country,
              city,
              district: district || { id: 0, name: "", cityId: 0 }
            });
            
          } catch (err) {
            setLocation(null);
          }
        } else {
          setLocation(null);
        }
      } catch (err) {
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    loadLocationFromCookie();
  }, []);

  // Konum güncelleme fonksiyonu
  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
    
    // Cookie'ye kaydet
    setCookie('selected_country', JSON.stringify(newLocation.country));
    setCookie('selected_city', JSON.stringify(newLocation.city));
    if (newLocation.district && newLocation.district.id > 0) {
      setCookie('selected_district', JSON.stringify(newLocation.district));
    } else {
      setCookie('selected_district', '', -1);
    }
  };

  // Konumu temizleme fonksiyonu
  const clearLocation = () => {
    setLocation(null);
    
    // Cookie'leri temizle
    setCookie('selected_country', '', -1);
    setCookie('selected_city', '', -1);
    setCookie('selected_district', '', -1);
    
  };

  return { 
    location, 
    loading, 
    error, 
    updateLocation, 
    clearLocation 
  };
}; 