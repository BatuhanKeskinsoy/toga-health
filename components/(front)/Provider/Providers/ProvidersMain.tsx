import React from 'react';
import ProviderCard from '@/components/(front)/Provider/ProviderCard';
import { IoInformationCircleOutline, IoSearchOutline } from 'react-icons/io5';

interface ProvidersMainProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
  providers: any[];
  loading?: boolean;
  totalProviders?: number;
  diseaseName?: string;
}

function ProvidersMain({ 
  diseaseSlug, 
  country, 
  city, 
  district, 
  providers, 
  loading = false, 
  totalProviders = 0, 
  diseaseName = "" 
}: ProvidersMainProps) {
  const error: string | null = null;

  if (!diseaseSlug || !country) {
    return (
      <div className="text-center text-gray-500 py-8">
        Lütfen ülke seçimi yapın.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full size-6 border-2 border-gray-300 border-t-sitePrimary"></div>
        </div>
        <div className="text-sm text-gray-600">Sağlayıcılar yükleniyor...</div>
      </div>
    );
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
      
      {/* Pagination will be handled by parent component */}
    </div>
  );
}

export default ProvidersMain;