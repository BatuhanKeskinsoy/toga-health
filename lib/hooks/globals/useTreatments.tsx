import { useState, useEffect, useCallback } from "react";
import { getTreatments } from "@/lib/services/categories/treatments";

export interface Treatment {
  id: number;
  name: string;
  slug: string;
  description: string;
  specialty: {
    id: number;
    name: string;
    slug: string;
  };
}

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadTreatments = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getTreatments();
      setTreatments(data || []);
    } catch (error) {
      console.error("Treatments fetch error:", error);
      setIsError(true);
      setTreatments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTreatments();
  }, [loadTreatments]);

  return {
    treatments,
    isLoading,
    isError,
    refetch: loadTreatments,
  };
}
