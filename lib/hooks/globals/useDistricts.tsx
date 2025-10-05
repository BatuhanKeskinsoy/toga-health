import { useState, useEffect, useCallback } from "react";
import { getDistricts } from "@/lib/services/locations";
import { District } from "@/lib/types/locations/locationsTypes";

export function useDistricts(countrySlug: string | null, citySlug: string | null) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadDistricts = useCallback(async () => {
    if (!countrySlug || !citySlug) {
      setDistricts([]);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      const response = await getDistricts(countrySlug, citySlug);
      setDistricts(response.districts || []);
    } catch (error) {
      console.error("Districts fetch error:", error);
      setIsError(true);
      setDistricts([]);
    } finally {
      setIsLoading(false);
    }
  }, [countrySlug, citySlug]);

  useEffect(() => {
    loadDistricts();
  }, [loadDistricts]);

  return {
    districts,
    isLoading,
    isError,
    refetch: loadDistricts,
  };
}
