"use client";
import React from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import ProvidersPaginationWrapper from "@/components/(front)/Provider/Providers/ProvidersPaginationWrapper";
import {
  IoCalendarOutline,
  IoInformationCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";
import {
  Provider,
  ProvidersPagination,
} from "@/lib/types/providers/providersTypes";

interface ProvidersMainProps {
  providersSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  locale?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  providers: Provider[];
  loading?: boolean;
  pagination?: ProvidersPagination;
  sortBy?: "created_at" | "rating" | "name";
  sortOrder?: "desc" | "asc";
  providerType?: "corporate" | "doctor" | null;
  searchQuery?: string;
  onDataChange?: (data: {
    providers: Provider[];
    pagination: ProvidersPagination;
    providersName: string;
    totalProviders: number;
  }) => void;
}

function ProvidersMain({
  providersSlug,
  country,
  city,
  district,
  categoryType,
  providers,
  loading = false,
  pagination,
  sortBy = "created_at",
  sortOrder = "desc",
  providerType = null,
  searchQuery = "",
  onDataChange,
}: ProvidersMainProps) {
  const error: string | null = null;

  if (!providersSlug || !country) {
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
          <div className="text-lg font-semibold text-gray-900">
            Sağlayıcı Bulunamadı
          </div>
          <div className="text-sm text-gray-600 max-w-md">
            Bu kriterlere uygun sağlayıcı bulunamadı. Farklı filtreler
            deneyebilirsiniz.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 w-full max-lg:px-4 pb-8">
      {/* Provider Cards */}
      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="w-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-0"
          >
            <ProviderCard
              key={provider.id}
              providerData={provider}
              isHospital={provider.user_type === "corporate"}
              onList={true}
            />
            <div className="flex flex-col gap-3 h-full items-center justify-center bg-white lg:rounded-r-md rounded-b-md border-y border-r lg:border-l-0 border-l border-gray-200 p-4 text-center text-gray-500">
              <IoCalendarOutline size={44} />

              <span className="text-sm font-medium">BU KISMA RANDEVU SAATLERİ GELECEK</span>
              <span className="text-xs text-gray-400">
                Bu sağlayıcının randevu saatleri henüz belirlenmemiştir.
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <ProvidersPaginationWrapper
        providersSlug={providersSlug}
        country={country}
        city={city}
        district={district}
        categoryType={categoryType}
        sortBy={sortBy}
        sortOrder={sortOrder}
        providerType={providerType}
        searchQuery={searchQuery}
        initialPagination={pagination}
        onDataChange={onDataChange}
      />
    </div>
  );
}

export default ProvidersMain;
