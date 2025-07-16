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
        
        // Cookie'den ülke ve şehir bilgilerini al
        const countryCookie = getCookie('selected_country');
        const cityCookie = getCookie('selected_city');
        
        if (countryCookie && cityCookie) {
          try {
            const country = JSON.parse(countryCookie);
            const city = JSON.parse(cityCookie);
            
            setLocation({
              country,
              city
            });
            
            console.log('Cookie\'den yüklenen konum:', { country, city });
          } catch (err) {
            console.error('Cookie parse hatası:', err);
            setLocation(null);
          }
        } else {
          setLocation(null);
        }
      } catch (err) {
        console.error('Cookie yükleme hatası:', err);
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
    
    console.log('Konum güncellendi ve cookie\'ye kaydedildi:', newLocation);
  };

  // Konumu temizleme fonksiyonu
  const clearLocation = () => {
    setLocation(null);
    
    // Cookie'leri temizle
    setCookie('selected_country', '', -1);
    setCookie('selected_city', '', -1);
    
    console.log('Konum temizlendi');
  };

  return { 
    location, 
    loading, 
    error, 
    updateLocation, 
    clearLocation 
  };
}; 