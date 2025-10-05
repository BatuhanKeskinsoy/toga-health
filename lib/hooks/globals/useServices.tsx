import { useState, useEffect, useCallback } from "react";
import { getServices } from "@/lib/services/categories/services";

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  currency: string;
  duration_minutes: number;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getServices();
      setServices(data || []);
    } catch (error) {
      console.error("Services fetch error:", error);
      setIsError(true);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return {
    services,
    isLoading,
    isError,
    refetch: loadServices,
  };
}
