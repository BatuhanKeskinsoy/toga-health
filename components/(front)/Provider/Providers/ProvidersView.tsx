import React from "react";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import ProviderFiltersWrapper from "@/components/(front)/Provider/Providers/ProviderFiltersWrapper";
import ProvidersClientWrapper from "./ProvidersClientWrapper";
import { getProviderAppointmentServices } from "@/lib/services/appointment/services";

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

  // Her provider için varsayılan adres/doktor için appointment servislerini çek
  const fetchInitialAppointmentData = async (provider: Provider) => {
    try {
      const isHospital = provider.user_type === "corporate";
      
      if (isHospital) {
        // Hastane için: İlk doktoru al ve appointment servislerini çek
        const doctors = (provider as any).doctors || [];
        if (doctors.length === 0) return null;
        
        const firstDoctor = doctors[0];
        const doctorId = firstDoctor.id;
        const corporateId = provider.id;

        if (!doctorId || !corporateId) return null;

        const result = await getProviderAppointmentServices(
          doctorId,
          undefined, // Hastane detayında address_id göndermiyoruz
          corporateId
        );

        return result.success ? result.data : null;
      } else {
        // Doktor için: Varsayılan adresi al ve appointment servislerini çek
        const addresses = (provider as any).addresses || [];
        if (addresses.length === 0) return null;

        const defaultAddress = addresses.find((addr: any) => addr.is_default) || addresses[0];
        const addressId = defaultAddress.address_id || defaultAddress.id?.toString();
        const doctorId = provider.id;

        if (!addressId || !doctorId) return null;

        const result = await getProviderAppointmentServices(
          doctorId,
          addressId,
          undefined
        );

        return result.success ? result.data : null;
      }
    } catch (error) {
      console.error(`Error fetching appointment data for provider ${provider.id}:`, error);
      return null;
    }
  };

  // Tüm providerlar için appointment verilerini paralel olarak çek
  const providersWithAppointmentData = await Promise.all(
    providers.map(async (provider) => {
      const appointmentData = await fetchInitialAppointmentData(provider);
      return {
        provider,
        appointmentData,
      };
    })
  );

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
          categoryType={categoryType}
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
        initialAppointmentDataMap={providersWithAppointmentData.reduce((acc, item) => {
          acc[item.provider.id] = item.appointmentData;
          return acc;
        }, {} as Record<number, any>)}
      />
    </>
  );
}

export default ProvidersView;