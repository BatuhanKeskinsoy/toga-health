import { useState, useCallback } from 'react';
import { search, getPopularBranches, searchWithQuery } from '@/lib/services/search/search';
import { SearchResponse, SearchParams, UseSearchReturn } from '@/lib/types/search/searchTypes';

export const useSearch = (): UseSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await search(params);
      setSearchResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Arama sırasında bir hata oluştu';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    search: performSearch,
    clearResults
  };
};

// Popüler branşlar için özel hook
export const usePopularBranches = () => {
  const [popularBranches, setPopularBranches] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularBranches = useCallback(async (params: {
    countryId: string;
    cityId: string;
    districtId: string;
    lang?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await getPopularBranches(params);
      setPopularBranches(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Popüler branşlar yüklenirken hata oluştu';
      setError(errorMessage);
      console.error('Popular branches error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    popularBranches,
    isLoading,
    error,
    fetchPopularBranches
  };
};

// Genel arama için özel hook
export const useSearchWithQuery = () => {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (params: {
    q: string;
    countryId: string;
    cityId: string;
    districtId: string;
    specialtyId?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    lang?: string;
    page?: number;
    per_page?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchWithQuery(params);
      setSearchResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Arama sırasında bir hata oluştu';
      setError(errorMessage);
      console.error('Search with query error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    search,
    clearResults
  };
};
