"use client";
import React, { useState } from "react";
import Pagination from "@/components/others/Pagination";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getBranchProviders } from "@/lib/services/categories/branches";
import { getTreatmentProviders } from "@/lib/services/categories/treatments";
import {
  Provider,
  ProvidersPagination,
  ProvidersResponse,
} from "@/lib/types/providers/providersTypes";

interface ProvidersPaginationWrapperProps {
  providersSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  sortBy?: "created_at" | "rating" | "name";
  sortOrder?: "desc" | "asc";
  providerType?: "corporate" | "doctor" | null;
  searchQuery?: string;
  initialPagination?: ProvidersPagination;
  onDataChange?: (data: {
    providers: Provider[];
    pagination: ProvidersPagination;
    providersName: string;
    totalProviders: number;
  }) => void;
}

function ProvidersPaginationWrapper({
  providersSlug,
  country,
  city,
  district,
  categoryType,
  sortBy = "created_at",
  sortOrder = "desc",
  providerType = null,
  searchQuery = "",
  initialPagination,
  onDataChange,
}: ProvidersPaginationWrapperProps) {
  const [currentPage, setCurrentPage] = useState(
    initialPagination?.current_page || 1
  );
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Sayfa değiştiğinde veri çek (URL'yi değiştirmeden)
  const handlePageChange = async (page: number) => {
    if (page === currentPage || isLoading || !providersSlug) return;

    setCurrentPage(page);
    setIsLoading(true);

    // Sayfayı en üste smooth scroll yap
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      let response: ProvidersResponse;
      
      const params = {
        providers_slug: providersSlug,
        country: country || "",
        city: city,
        district: district,
        page: page,
        per_page: 20, // Normal pagination
        sort_by: sortBy,
        sort_order: sortOrder,
        provider_type: providerType || undefined,
        q: searchQuery || undefined,
      };

      // Category type'a göre doğru servisi seç
      switch (categoryType) {
        case "diseases":
          response = await getDiseaseProviders(params);
          break;
        case "branches":
          response = await getBranchProviders(params);
          break;
        case "treatments-services":
          response = await getTreatmentProviders(params);
          break;
        default:
          response = await getDiseaseProviders(params);
      }

      if (response.status && response.data) {
        setPagination(response.data.providers.pagination);

        // Parent component'e yeni veriyi gönder
        if (onDataChange) {
          onDataChange({
            providers: response.data.providers.data,
            pagination: response.data.providers.pagination,
            providersName: response.data.information.name,
            totalProviders: response.data.providers.summary.total_providers,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching providers data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination göster
  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        from={pagination.from}
        to={pagination.to}
        onPageChange={handlePageChange}
        className="w-full max-w-2xl"
      />
    </div>
  );
}

export default ProvidersPaginationWrapper;
