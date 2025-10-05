import { useState, useEffect, useCallback } from "react";
import { getDiseases } from "@/lib/services/categories/diseases";

export interface Disease {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export function useDiseases() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadDiseases = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getDiseases();
      setDiseases(data || []);
    } catch (error) {
      console.error("Diseases fetch error:", error);
      setIsError(true);
      setDiseases([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiseases();
  }, [loadDiseases]);

  return {
    diseases,
    isLoading,
    isError,
    refetch: loadDiseases,
  };
}
