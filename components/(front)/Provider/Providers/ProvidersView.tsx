import React from "react";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import ProviderFiltersWrapper from "@/components/(front)/Provider/Providers/ProviderFiltersWrapper";
import ProvidersClientWrapper from "./ProvidersClientWrapper";

import { Provider, ProvidersPagination } from "@/lib/types/providers/providersTypes";

interface ProvidersViewProps {
  providersSlug?: string;
  providersName?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
  totalProviders?: number;
  countryName?: string;
  cityName?: string;
  districtName?: string;
  providers?: Provider[];
  pagination?: ProvidersPagination;
  sortBy?: 'created_at' | 'rating' | 'name';
  sortOrder?: 'desc' | 'asc';
  providerType?: 'corporate' | 'doctor' | null;
  categoryType?: "diseases" | "branches" | "treatments-services";
}

async function ProvidersView({
  providersSlug,
  providersName,
  country,
  city,
  district,
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
  categoryType,
}: ProvidersViewProps) {

  // Dinamik başlık oluştur
  const generateTitle = () => {
    if (!providersName) return "Doktorlar ve Hastaneler";
    
    if (countryName && cityName && districtName) {
      return `${providersName} ${countryName} ${cityName} ${districtName} Doktorlar ve Hastaneler`;
    } else if (countryName && cityName) {
      return `${providersName} ${countryName} ${cityName} Doktorlar ve Hastaneler`;
    } else if (countryName) {
      return `${providersName} ${countryName} Doktorlar ve Hastaneler`;
    } else {
      return `${providersName} Doktorlar ve Hastaneler`;
    }
  };

  // Dinamik açıklama oluştur
  const generateDescription = () => {
    if (!providersName) return "Sağlayıcılar listeleniyor.";
    
    const providerCount = totalProviders || 0;
    
    if (providerCount === 0) {
      if (countryName && cityName && districtName) {
        return `${providersName} ${countryName} ${cityName} ${districtName} lokasyonunda sağlayıcı bulunamadı.`;
      } else if (countryName && cityName) {
        return `${providersName} ${countryName} ${cityName} lokasyonunda sağlayıcı bulunamadı.`;
      } else if (countryName) {
        return `${providersName} ${countryName} lokasyonunda sağlayıcı bulunamadı.`;
      } else {
        return `${providersName} için sağlayıcı bulunamadı.`;
      }
    } else {
      if (countryName && cityName && districtName) {
        return `${providersName} ${countryName} ${cityName} ${districtName} lokasyonunda ${providerCount} sağlayıcı bulundu.`;
      } else if (countryName && cityName) {
        return `${providersName} ${countryName} ${cityName} lokasyonunda ${providerCount} sağlayıcı bulundu.`;
      } else if (countryName) {
        return `${providersName} ${countryName} lokasyonunda ${providerCount} sağlayıcı bulundu.`;
      } else {
        return `${providersName} için ${providerCount} sağlayıcı bulundu.`;
      }
    }
  };

  return (
    <>
      <div className="flex max-xl:flex-col justify-between xl:items-center xl:pb-2 xl:pt-0 xl:py-6 gap-4 max-xl:px-4">
        <div className="flex flex-col gap-1 w-full pl-4 border-l-4 border-sitePrimary">
          <h1 className="xl:text-xl text-lg font-medium">
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
        providersSlug={providersSlug}
        country={country}
        city={city}
        district={district}
        locale={locale}
        categoryType={categoryType}
        providers={providers}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        providerType={providerType}
      />
    </>
  );
}

export default ProvidersView;