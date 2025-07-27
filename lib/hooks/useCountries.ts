import { useState, useEffect } from 'react';
import { getCountries } from '@/lib/utils/locations/getCountries';

interface Country {
  id: number;
  name: string;
  slug: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getCountries();
        setCountries(data || []);
      } catch (err: any) {
        setError(err.message || 'Ülkeler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}; 