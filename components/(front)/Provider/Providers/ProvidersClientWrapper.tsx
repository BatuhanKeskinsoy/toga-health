"use client";
import React, { useState } from "react";
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
      providers={currentProviders}
      loading={loading}
      pagination={currentPagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      providerType={providerType}
      onDataChange={handleDataChange}
    />
  );
}

export default ProvidersClientWrapper;
