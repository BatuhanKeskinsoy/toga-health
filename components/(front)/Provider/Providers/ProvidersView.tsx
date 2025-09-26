import React from "react";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import ProviderFiltersWrapper from "@/components/(front)/Provider/Providers/ProviderFiltersWrapper";
import ProvidersClientWrapper from "./ProvidersClientWrapper";

import { DiseaseProvider, DiseasePagination } from "@/lib/types/providers/providersTypes";

interface ProvidersViewProps {
  diseaseSlug?: string;
  diseaseName?: string;
  country?: string;
  city?: string;
  district?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  locale?: string;
  totalProviders?: number;
  countryName?: string;
  cityName?: string;
  districtName?: string;
  providers?: DiseaseProvider[];
  pagination?: DiseasePagination;
  sortBy?: 'created_at' | 'rating' | 'name';
  sortOrder?: 'desc' | 'asc';
  providerType?: 'corporate' | 'doctor' | null;
}

async function ProvidersView({
  diseaseSlug,
  diseaseName,
  country,
  city,
  district,
  categoryType = "diseases",
  locale = "tr",
  totalProviders,
  countryName,
  cityName,
  districtName,
  providers = [],
  pagination,
  sortBy = 'created_at',
  sortOrder = 'desc',
  providerType = null,
}: ProvidersViewProps) {

  // Dinamik başlık oluştur
  const generateTitle = () => {
    if (!diseaseName) return "Doktorlar ve Hastaneler";
    
    if (countryName && cityName && districtName) {
      return `${diseaseName} ${countryName} ${cityName} ${districtName} Doktorlar ve Hastaneler`;
    } else if (countryName && cityName) {
      return `${diseaseName} ${countryName} ${cityName} Doktorlar ve Hastaneler`;
    } else if (countryName) {
      return `${diseaseName} ${countryName} Doktorlar ve Hastaneler`;
    } else {
      return `${diseaseName} Doktorlar ve Hastaneler`;
    }
  };

  // Dinamik açıklama oluştur
  const generateDescription = () => {
    if (!diseaseName) return "Sağlayıcılar listeleniyor.";
    
    const providerCount = totalProviders || 0;
    
    if (providerCount === 0) {
      if (countryName && cityName && districtName) {
        return `${diseaseName} ${countryName} ${cityName} ${districtName} lokasyonunda sağlayıcı bulunamadı.`;
      } else if (countryName && cityName) {
        return `${diseaseName} ${countryName} ${cityName} lokasyonunda sağlayıcı bulunamadı.`;
      } else if (countryName) {
        return `${diseaseName} ${countryName} lokasyonunda sağlayıcı bulunamadı.`;
      } else {
        return `${diseaseName} için sağlayıcı bulunamadı.`;
      }
    } else {
      if (countryName && cityName && districtName) {
        return `${diseaseName} ${countryName} ${cityName} ${districtName} lokasyonunda ${providerCount} sağlayıcı bulundu.`;
      } else if (countryName && cityName) {
        return `${diseaseName} ${countryName} ${cityName} lokasyonunda ${providerCount} sağlayıcı bulundu.`;
      } else if (countryName) {
        return `${diseaseName} ${countryName} lokasyonunda ${providerCount} sağlayıcı bulundu.`;
      } else {
        return `${diseaseName} için ${providerCount} sağlayıcı bulundu.`;
      }
    }
  };

  return (
    <>
      <div className="flex max-lg:flex-col justify-between lg:items-center lg:pb-2 lg:pt-0 lg:py-6 gap-4 max-lg:px-4">
        <div className="flex flex-col gap-1 w-full pl-4 border-l-4 border-sitePrimary">
          <h1 className="lg:text-xl text-lg font-medium">
            {generateTitle()}
          </h1>
          <p className="text-xs text-gray-500">
            {generateDescription()}
          </p>
        </div>
        <ProviderFiltersWrapper
          sortBy={sortBy}
          sortOrder={sortOrder}
          providerType={providerType}
        />
      </div>
      <ProvidersClientWrapper
        diseaseSlug={diseaseSlug}
        country={country}
        city={city}
        district={district}
        locale={locale}
        providers={providers}
        totalProviders={totalProviders}
        diseaseName={diseaseName}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        providerType={providerType}
      />
    </>
  );
}

export default ProvidersView;