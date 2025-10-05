import { useState, useEffect, useCallback } from "react";
import { getBranches } from "@/lib/services/categories/branches";

export interface Branch {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getBranches();
      setBranches(data || []);
    } catch (error) {
      console.error("Branches fetch error:", error);
      setIsError(true);
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  return {
    branches,
    isLoading,
    isError,
    refetch: loadBranches,
  };
}
