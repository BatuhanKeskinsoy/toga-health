import React from 'react';
import { getDiseaseProviders } from '@/lib/services/categories/diseases';
import { DiseaseProvidersResponse, DiseaseProvider } from '@/lib/types/categories/diseasesTypes';
import ProviderCard from '@/components/(front)/Provider/ProviderCard';
import { IoInformationCircleOutline, IoSearchOutline } from 'react-icons/io5';

interface ProvidersMainProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
}

async function ProvidersMain({ diseaseSlug, country, city, district }: ProvidersMainProps) {
  let providers: DiseaseProvider[] = [];
  let pagination: any = null;
  let error: string | null = null;
  let diseaseName: string | null = null;
  let totalProviders: number = 0;

  if (!diseaseSlug || !country) {
    return (
      <div className="text-center text-gray-500 py-8">
        Lütfen ülke seçimi yapın.
      </div>
    );
  }

  try {
    const response: DiseaseProvidersResponse = await getDiseaseProviders({
      disease_slug: diseaseSlug,
      country: country,
      city: city,
      district: district,
      page: 1,
      per_page: 20
    });

    if (response.status && response.data) {
      providers = response.data.providers.data;
      pagination = response.data.providers.pagination;
      diseaseName = response.data.disease.name;
      totalProviders = response.data.providers.summary.total_providers;
    }
  } catch (err) {
    console.error('Provider fetch error:', err);
    error = 'Sağlayıcılar yüklenirken bir hata oluştu.';
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <IoInformationCircleOutline className="text-2xl text-red-600" />
        </div>
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold text-red-600">Hata Oluştu</div>
          <div className="text-sm text-gray-600 max-w-md">{error}</div>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <IoSearchOutline className="text-2xl text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold text-gray-900">Sağlayıcı Bulunamadı</div>
          <div className="text-sm text-gray-600 max-w-md">
            Bu kriterlere uygun sağlayıcı bulunamadı. Farklı filtreler deneyebilirsiniz.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-lg:px-4">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          providerData={provider}
          isHospital={provider.user_type === 'corporate'}
          onList={true}
        />
      ))}
      
      {pagination && pagination.has_more_pages && (
        <div className="text-center py-4">
          <button className="bg-sitePrimary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all duration-300">
            Daha Fazla Yükle
          </button>
        </div>
      )}
    </div>
  );
}

export default ProvidersMain;