import { useState, useCallback } from "react";
import axios from "@/lib/axios";

interface SearchResult {
  id: string;
  name: string;
  branch?: string;
  branchSlug?: string;
  category?: string;
  photo?: string;
  slug?: string;
}

interface PopularBranch {
  name: string;
  slug: string;
  description: string;
}

interface SearchResponse {
  success: boolean;
  data?: {
    query: string;
    countryId: string;
    cityId: string;
    districtId?: string;
    results: {
      specialists: SearchResult[];
      hospitals: SearchResult[];
      hastaliklar: SearchResult[];
      tedaviHizmetler: SearchResult[];
      popularBranches?: PopularBranch[];
    };
    totalCount: number;
  };
  message?: string;
}

interface UseSearchProps {
  countryId?: number;
  cityId?: number;
  districtId?: number;
}

export const useSearch = ({ countryId, cityId, districtId }: UseSearchProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse["data"] | null>(null);

  const search = useCallback(async (query: string) => {
    if (!countryId || !cityId) {
      setError("Ülke ve şehir seçimi gerekli");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        q: query,
        countryId,
        cityId
      };

      if (districtId) {
        params.districtId = districtId;
      }

      const response = await axios.get<SearchResponse>("http://localhost:3000/api/search", {
        params
      });

      if (response.data.success) {
        setResults(response.data.data || null);
      } else {
        setError(response.data.message || "Arama başarısız");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Arama sırasında hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [countryId, cityId, districtId]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    search,
    clearResults,
    loading,
    error,
    results
  };
}; 