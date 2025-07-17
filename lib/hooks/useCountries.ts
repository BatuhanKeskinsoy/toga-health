import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface Country {
  id: number;
  name: string;
  code: string;
}

interface CountriesResponse {
  success: boolean;
  data?: Country[];
  message?: string;
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
        
        const response = await axios.get<CountriesResponse>('http://localhost:3000/api/countries');
        
        if (response.data.success) {
          setCountries(response.data.data || []);
        } else {
          setError(response.data.message || 'Ülkeler yüklenirken hata oluştu');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ülkeler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}; 