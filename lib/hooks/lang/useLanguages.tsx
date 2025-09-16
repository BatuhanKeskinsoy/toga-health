import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export type Language = {
  id: number;
  name: string;
  code: string;
  direction: "ltr" | "rtl";
};

const fetchLanguages = async (): Promise<Language[]> => {
  const res = await api.get(`/public/languages`);
  return res.data?.data || [];
};

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadLanguages = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchLanguages();
      setLanguages(data);
    } catch (error) {
      console.error("Languages fetch error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  return {
    languages,
    isLoading,
    isError,
    refetch: loadLanguages,
  };
}
