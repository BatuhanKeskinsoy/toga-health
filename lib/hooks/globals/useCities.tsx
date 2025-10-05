import { useState, useEffect, useCallback } from "react";
import { getCities } from "@/lib/services/locations";
import { City } from "@/lib/types/locations/locationsTypes";

export function useCities(countrySlug: string | null) {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadCities = useCallback(async () => {
    if (!countrySlug) {
      setCities([]);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      const response = await getCities(countrySlug);
      setCities(response.cities || []);
    } catch (error) {
      console.error("Cities fetch error:", error);
      setIsError(true);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, [countrySlug]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  return {
    cities,
    isLoading,
    isError,
    refetch: loadCities,
  };
}
