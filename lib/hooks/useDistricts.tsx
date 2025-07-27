"use client";
import { useState, useEffect } from "react";
import { getDistricts } from "@/lib/utils/locations/getDistricts";

interface District {
  id: number;
  name: string;
  slug: string;
  citySlug: string;
}

interface UseDistrictsReturn {
  districts: District[];
  loading: boolean;
  error: string | null;
}

export const useDistricts = (countrySlug: string | null, citySlug: string | null): UseDistrictsReturn => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!citySlug) {
        setDistricts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getDistricts(countrySlug, citySlug);
        setDistricts(data);
      } catch (err: any) {
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [countrySlug, citySlug]);

  return { districts, loading, error };
}; 