import { useState, useEffect } from 'react';

interface Country {
  id: number;
  name: string;
  code: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/countries');
        const data = await response.json();
        
        if (data.success) {
          setCountries(data.data);
        } else {
          setError(data.message || 'Ülkeler yüklenirken hata oluştu');
        }
      } catch (err) {
        setError('Ülkeler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}; 