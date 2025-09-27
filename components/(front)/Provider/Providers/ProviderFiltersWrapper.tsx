"use client";

import React from "react";
import ProviderFilters from "./ProviderFilters";
import { clearProvidersLayoutCache } from "@/lib/utils/getProvidersLayoutData";

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
    
    clearProvidersLayoutCache();
    
    // Cookie'ye kaydet
    const secure = process.env.NODE_ENV === 'production' ? '; secure' : '';
    document.cookie = `provider_sort_by=${newSortBy}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${secure}`;
    document.cookie = `provider_sort_order=${newSortOrder}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${secure}`;
    
    // Sayfayı yenile
    window.location.reload();
  };

  const handleProviderTypeChange = (newProviderType: 'corporate' | 'doctor' | null) => {
    
    // Cache'i temizle
    clearProvidersLayoutCache();
    
    // Cookie'ye kaydet
    const secure = process.env.NODE_ENV === 'production' ? '; secure' : '';
    if (newProviderType) {
      document.cookie = `provider_type=${newProviderType}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax${secure}`;
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
