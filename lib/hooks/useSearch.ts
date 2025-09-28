import { useState, useCallback } from "react";
import { search, getPopularBranches } from "@/lib/services/search/search";
import { SearchResponse, SearchParams } from "@/lib/types/search/searchTypes";

interface UseSearchProps {
  countryId?: string;
  cityId?: string;
  districtId?: string;
}

export const useSearch = ({ countryId, cityId, districtId }: UseSearchProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);

  const searchWithQuery = useCallback(async (query: string) => {
    // Artık ülke seçimi zorunlu değil
    // if (!countryId) {
    //   setError("Ülke seçimi gerekli");
    //   return;
    // }

    setLoading(true);
    setError(null);

    try {
      const params: SearchParams = {
        q: query,
        countryId: countryId || "",
        cityId: cityId || "",
        districtId: districtId || ""
      };

      const response = await search(params);
      setResults(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Arama sırasında hata oluştu";
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [countryId, cityId, districtId]);

  const searchPopularBranches = useCallback(async () => {
    // Artık ülke seçimi zorunlu değil
    // if (!countryId) {
    //   setError("Ülke seçimi gerekli");
    //   return;
    // }

    setLoading(true);
    setError(null);

    try {
      const response = await getPopularBranches({
        countryId: countryId || "",
        cityId: cityId || "",
        districtId: districtId || ''
      });
      setResults(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Popüler branşlar yüklenirken hata oluştu";
      setError(errorMessage);
      console.error('Popular branches error:', err);
    } finally {
      setLoading(false);
    }
  }, [countryId, cityId, districtId]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    search: searchWithQuery,
    searchPopularBranches,
    clearResults,
    loading,
    error,
    results
  };
}; 