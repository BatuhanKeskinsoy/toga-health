"use client";
import React, { useState } from "react";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import { DiseaseProvider, DiseasePagination } from "@/lib/types/categories/diseasesTypes";

interface ProvidersClientWrapperProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
  providers: DiseaseProvider[];
  totalProviders?: number;
  diseaseName?: string;
  pagination?: DiseasePagination;
  sortBy?: 'created_at' | 'rating' | 'name';
  sortOrder?: 'desc' | 'asc';
  providerType?: 'corporate' | 'doctor' | null;
}

function ProvidersClientWrapper({
  diseaseSlug,
  country,
  city,
  district,
  locale,
  providers: initialProviders,
  totalProviders: initialTotalProviders,
  diseaseName: initialDiseaseName,
  pagination: initialPagination,
  sortBy = 'created_at',
  sortOrder = 'desc',
  providerType = null,
}: ProvidersClientWrapperProps) {
  // State management
  const [currentProviders, setCurrentProviders] = useState(initialProviders);
  const [currentPagination, setCurrentPagination] = useState(initialPagination);
  const [currentDiseaseName, setCurrentDiseaseName] = useState(initialDiseaseName || "");
  const [currentTotalProviders, setCurrentTotalProviders] = useState(initialTotalProviders || 0);
  const [loading, setLoading] = useState(false);

  // Pagination data handler
  const handleDataChange = (data: {
    providers: DiseaseProvider[];
    pagination: DiseasePagination;
    diseaseName: string;
    totalProviders: number;
  }) => {
    setLoading(true);
    setCurrentProviders(data.providers);
    setCurrentPagination(data.pagination);
    setCurrentDiseaseName(data.diseaseName);
    setCurrentTotalProviders(data.totalProviders);
    setLoading(false);
  };

  return (
    <ProvidersMain
      diseaseSlug={diseaseSlug}
      country={country}
      city={city}
      district={district}
      locale={locale}
      providers={currentProviders}
      loading={loading}
      totalProviders={currentTotalProviders}
      diseaseName={currentDiseaseName}
      pagination={currentPagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      providerType={providerType}
      onDataChange={handleDataChange}
    />
  );
}

export default ProvidersClientWrapper;
