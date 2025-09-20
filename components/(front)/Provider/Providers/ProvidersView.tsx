import React from "react";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import ProviderFiltersWrapper from "@/components/(front)/Provider/Providers/ProviderFiltersWrapper";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { DiseaseProvidersResponse } from "@/lib/types/categories/diseasesTypes";
import { getServerProviderFilters } from "@/lib/utils/cookies";

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
}: ProvidersViewProps) {
  // Cookie'den filtreleri al
  const cookieFilters = await getServerProviderFilters();
  
  const sortBy = cookieFilters?.sortBy || 'created_at';
  const sortOrder = cookieFilters?.sortOrder || 'desc';
  const providerType = cookieFilters?.providerType || null;

  let currentDiseaseName = diseaseName || "";
  let currentTotalProviders = totalProviders || 0;
  let providers: any[] = [];
  let loading = false;

  // Server-side'da veri çek
  if (diseaseSlug && country) {
    try {
      const response: DiseaseProvidersResponse = await getDiseaseProviders({
        disease_slug: diseaseSlug,
        country: country,
        city: city,
        district: district,
        page: 1,
        per_page: 20,
        sort_by: sortBy,
        sort_order: sortOrder,
        provider_type: providerType || undefined
      });

      if (response.status && response.data) {
        currentDiseaseName = response.data.disease.name;
        currentTotalProviders = response.data.providers.summary.total_providers;
        providers = response.data.providers.data;
      }
    } catch (error) {
      console.error('Error fetching disease data:', error);
    }
  }

  // Dinamik başlık oluştur
  const generateTitle = () => {
    if (!currentDiseaseName) return "Doktorlar ve Hastaneler";
    
    if (countryName && cityName && districtName) {
      return `${currentDiseaseName} ${countryName} ${cityName} ${districtName} Doktorlar ve Hastaneler`;
    } else if (countryName && cityName) {
      return `${currentDiseaseName} ${countryName} ${cityName} Doktorlar ve Hastaneler`;
    } else if (countryName) {
      return `${currentDiseaseName} ${countryName} Doktorlar ve Hastaneler`;
    } else {
      return `${currentDiseaseName} Doktorlar ve Hastaneler`;
    }
  };

  // Dinamik açıklama oluştur
  const generateDescription = () => {
    if (!currentDiseaseName) return "Sağlayıcılar listeleniyor.";
    
    if (currentTotalProviders === 0) {
      if (countryName && cityName && districtName) {
        return `${currentDiseaseName} ${countryName} ${cityName} ${districtName} lokasyonunda sağlayıcı bulunamadı.`;
      } else if (countryName && cityName) {
        return `${currentDiseaseName} ${countryName} ${cityName} lokasyonunda sağlayıcı bulunamadı.`;
      } else if (countryName) {
        return `${currentDiseaseName} ${countryName} lokasyonunda sağlayıcı bulunamadı.`;
      } else {
        return `${currentDiseaseName} için sağlayıcı bulunamadı.`;
      }
    } else {
      if (countryName && cityName && districtName) {
        return `${currentDiseaseName} ${countryName} ${cityName} ${districtName} lokasyonunda ${currentTotalProviders} sağlayıcı bulundu.`;
      } else if (countryName && cityName) {
        return `${currentDiseaseName} ${countryName} ${cityName} lokasyonunda ${currentTotalProviders} sağlayıcı bulundu.`;
      } else if (countryName) {
        return `${currentDiseaseName} ${countryName} lokasyonunda ${currentTotalProviders} sağlayıcı bulundu.`;
      } else {
        return `${currentDiseaseName} için ${currentTotalProviders} sağlayıcı bulundu.`;
      }
    }
  };

  return (
    <>
      <div className="flex max-lg:flex-col justify-between lg:items-center lg:py-2 py-6 gap-4 max-lg:px-4">
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
      <ProvidersMain
        diseaseSlug={diseaseSlug}
        country={country}
        city={city}
        district={district}
        locale={locale}
        providers={providers}
        loading={loading}
        totalProviders={currentTotalProviders}
        diseaseName={currentDiseaseName}
      />
    </>
  );
}

export default ProvidersView;