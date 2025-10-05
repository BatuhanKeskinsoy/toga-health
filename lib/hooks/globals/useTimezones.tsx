import { useState, useEffect, useCallback } from "react";
import { getTimezones } from "@/lib/services/globals";
import { Timezone } from "@/lib/types/globals";

const fetchTimezones = async (): Promise<Timezone[]> => {
  const res = await getTimezones();
  return res.data || [];
};

export function useTimezones() {
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadTimezones = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchTimezones();
      setTimezones(data);
    } catch (error) {
      console.error("Timezones fetch error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimezones();
  }, [loadTimezones]);

  return {
    timezones,
    isLoading,
    isError,
    refetch: loadTimezones,
  };
}
