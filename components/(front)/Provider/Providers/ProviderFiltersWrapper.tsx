"use client";

import React from "react";
import ProviderFilters from "./ProviderFilters";

interface ProviderFiltersWrapperProps {
  sortBy: 'rating' | 'name' | 'created_at';
  sortOrder: 'asc' | 'desc';
  providerType: 'corporate' | 'doctor' | null;
}

export default function ProviderFiltersWrapper({
  sortBy,
  sortOrder,
  providerType,
}: ProviderFiltersWrapperProps) {
  const handleSortChange = (newSortBy: 'rating' | 'name' | 'created_at', newSortOrder: 'asc' | 'desc') => {
    // Cookie'ye kaydet
    document.cookie = `provider_sort_by=${newSortBy}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    document.cookie = `provider_sort_order=${newSortOrder}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    
    // Sayfayı yenile
    window.location.reload();
  };

  const handleProviderTypeChange = (newProviderType: 'corporate' | 'doctor' | null) => {
    // Cookie'ye kaydet
    if (newProviderType) {
      document.cookie = `provider_type=${newProviderType}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    } else {
      document.cookie = `provider_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    
    // Sayfayı yenile
    window.location.reload();
  };

  return (
    <ProviderFilters
      sortBy={sortBy}
      sortOrder={sortOrder}
      providerType={providerType}
      onSortChange={handleSortChange}
      onProviderTypeChange={handleProviderTypeChange}
    />
  );
}
