import { useState, useEffect } from 'react';
import { getCities } from '@/lib/utils/locations/getCities';

interface City {
  id: number;
  name: string;
  slug: string;
  countrySlug: string;
}

export const useCities = (countrySlug: string | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      if (!countrySlug) {
        setCities([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await getCities(countrySlug);
        setCities(data || []);
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