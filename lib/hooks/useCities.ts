import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface City {
  id: number;
  name: string;
  countryId: number;
}

interface CitiesResponse {
  success: boolean;
  data?: City[];
  message?: string;
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
        
        const response = await axios.get<CitiesResponse>(`http://localhost:3000/api/cities/${countryId}`);
        
        if (response.data.success) {
          setCities(response.data.data || []);
        } else {
          setError(response.data.message || 'Şehirler yüklenirken hata oluştu');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Şehirler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [countryId]);

  return { cities, loading, error };
}; 