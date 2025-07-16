import { useState, useEffect } from 'react';

interface City {
  id: number;
  name: string;
  countryId: number;
}

export const useCities = (countryId: number | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      if (!countryId) {
        setCities([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/cities/${countryId}`);
        const data = await response.json();
        
        if (data.success) {
          setCities(data.data);
        } else {
          setError(data.message || 'Şehirler yüklenirken hata oluştu');
        }
      } catch (err) {
        setError('Şehirler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [countryId]);

  return { cities, loading, error };
}; 