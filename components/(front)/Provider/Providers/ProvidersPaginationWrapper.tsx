"use client";
import React, { useState } from 'react';
import Pagination from '@/components/others/Pagination';
import { getDiseaseProviders } from '@/lib/services/categories/diseases';
import { DiseaseProvidersResponse, DiseaseProvider, DiseasePagination } from '@/lib/types/categories/diseasesTypes';

interface ProvidersPaginationWrapperProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  sortBy?: 'created_at' | 'rating' | 'name';
  sortOrder?: 'desc' | 'asc';
  providerType?: 'corporate' | 'doctor' | null;
  initialPagination?: DiseasePagination;
  onDataChange?: (data: {
    providers: DiseaseProvider[];
    pagination: DiseasePagination;
    diseaseName: string;
    totalProviders: number;
  }) => void;
}

function ProvidersPaginationWrapper({
  diseaseSlug,
  country,
  city,
  district,
  sortBy = 'created_at',
  sortOrder = 'desc',
  providerType = null,
  initialPagination,
  onDataChange
}: ProvidersPaginationWrapperProps) {
  const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Sayfa değiştiğinde veri çek (URL'yi değiştirmeden)
  const handlePageChange = async (page: number) => {
    if (page === currentPage || isLoading || !diseaseSlug || !country) return;
    
    setCurrentPage(page);
    setIsLoading(true);

    // Sayfayı en üste smooth scroll yap
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response: DiseaseProvidersResponse = await getDiseaseProviders({
        disease_slug: diseaseSlug,
        country: country,
        city: city,
        district: district,
        page: page,
        per_page: 20,
        sort_by: sortBy,
        sort_order: sortOrder,
        provider_type: providerType || undefined
      });

      if (response.status && response.data) {
        setPagination(response.data.providers.pagination);
        
        // Parent component'e yeni veriyi gönder
        if (onDataChange) {
          onDataChange({
            providers: response.data.providers.data,
            pagination: response.data.providers.pagination,
            diseaseName: response.data.disease.name,
            totalProviders: response.data.providers.summary.total_providers
          });
        }
      }
    } catch (error) {
      console.error('Error fetching disease data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Pagination
        currentPage={pagination.current_page}
        lastPage={pagination.last_page}
        total={pagination.total}
        perPage={pagination.per_page}
        from={pagination.from}
        to={pagination.to}
        hasMorePages={pagination.has_more_pages}
        onPageChange={handlePageChange}
        className="w-full max-w-2xl"
      />
    </div>
  );
}

export default ProvidersPaginationWrapper;
