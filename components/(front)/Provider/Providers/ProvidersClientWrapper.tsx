"use client";
import React, { useState, useEffect } from "react";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import {
  Provider,
  ProvidersPagination,
} from "@/lib/types/providers/providersTypes";

interface ProvidersClientWrapperProps {
  providersSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  providers: Provider[];
  pagination?: ProvidersPagination;
  sortBy?: "created_at" | "rating" | "name";
  sortOrder?: "desc" | "asc";
  providerType?: "corporate" | "doctor" | null;
}

function ProvidersClientWrapper({
  providersSlug,
  country,
  city,
  district,
  locale,
  categoryType,
  providers: initialProviders,
  pagination: initialPagination,
  sortBy = "created_at",
  sortOrder = "desc",
  providerType = null,
}: ProvidersClientWrapperProps) {
  // State management
  const [currentProviders, setCurrentProviders] = useState(initialProviders);
  const [currentPagination, setCurrentPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState(initialProviders);

  // Client-side filtreleme artık kullanılmıyor, server-side arama kullanılıyor

  // Listen for search events from sidebar
  useEffect(() => {
    const handleSearch = async (event: CustomEvent) => {
      const { searchQuery: query } = event.detail;
      setSearchQuery(query);
      
      // Arama yapıldığında API'den tüm verileri çek
      if (query.trim()) {
        setLoading(true);
        try {
          // API'den tüm arama sonuçlarını çek
          const response = await fetchProvidersWithSearch(query);
          if (response) {
            setCurrentProviders(response.providers);
            setCurrentPagination(response.pagination);
            setFilteredProviders(response.providers); // Server-side arama sonuçları
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Arama temizlendiğinde orijinal verileri geri yükle
        setCurrentProviders(initialProviders);
        setCurrentPagination(initialPagination);
        setFilteredProviders(initialProviders);
      }
    };

    window.addEventListener('providerSearch', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('providerSearch', handleSearch as EventListener);
    };
  }, [initialProviders]);

  // API'den arama sonuçlarını çek
  const fetchProvidersWithSearch = async (query: string) => {
    if (!providersSlug || !country) return null;

    try {
      // Hangi servisi kullanacağımızı belirle
      let response;
      const params = {
        providers_slug: providersSlug,
        country: country,
        city: city,
        district: district,
        page: 1,
        per_page: 9999,
        sort_by: sortBy,
        sort_order: sortOrder,
        provider_type: providerType || undefined,
        q: query,
      };

      // Category type'a göre doğru servisi seç
      switch (categoryType) {
        case "diseases":
          const { getDiseaseProviders } = await import("@/lib/services/categories/diseases");
          response = await getDiseaseProviders(params);
          break;
        case "branches":
          const { getBranchProviders } = await import("@/lib/services/categories/branches");
          response = await getBranchProviders(params);
          break;
        case "treatments-services":
          const { getTreatmentProviders } = await import("@/lib/services/categories/treatments");
          response = await getTreatmentProviders(params);
          break;
        default:
          const { getDiseaseProviders: getDefaultProviders } = await import("@/lib/services/categories/diseases");
          response = await getDefaultProviders(params);
      }

      if (response.status && response.data) {
        return {
          providers: response.data.providers.data,
          pagination: response.data.providers.pagination,
        };
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    return null;
  };

  // Pagination data handler
  const handleDataChange = (data: {
    providers: Provider[];
    pagination: ProvidersPagination;
    providersName: string;
    totalProviders: number;
  }) => {
    setLoading(true);
    setCurrentProviders(data.providers);
    setCurrentPagination(data.pagination);
    setLoading(false);
  };

  return (
    <ProvidersMain
      providersSlug={providersSlug}
      country={country}
      city={city}
      district={district}
      locale={locale}
      categoryType={categoryType}
      providers={filteredProviders}
      loading={loading}
      pagination={currentPagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      providerType={providerType}
      onDataChange={handleDataChange}
      searchQuery={searchQuery}
    />
  );
}

export default ProvidersClientWrapper;
