import { useState, useEffect, useCallback } from "react";
import { getPhoneCodes } from "@/lib/services/globals";

const fetchPhoneCodes = async (): Promise<string[]> => {
  const res = await getPhoneCodes();
  return res.data || [];
};

export function usePhoneCodes() {
  const [phoneCodes, setPhoneCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadPhoneCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchPhoneCodes();
      setPhoneCodes(data);
    } catch (error) {
      console.error("Phone codes fetch error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhoneCodes();
  }, [loadPhoneCodes]);

  return {
    phoneCodes,
    isLoading,
    isError,
    refetch: loadPhoneCodes,
  };
}
