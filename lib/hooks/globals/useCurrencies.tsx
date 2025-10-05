import { useState, useEffect, useCallback } from "react";
import { getCurrencies } from "@/lib/services/globals";
import { Currency } from "@/lib/types/globals";

const fetchCurrencies = async (): Promise<Currency[]> => {
  const res = await getCurrencies();
  return res.data || [];
};

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadCurrencies = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error("Currencies fetch error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  return {
    currencies,
    isLoading,
    isError,
    refetch: loadCurrencies,
  };
}
