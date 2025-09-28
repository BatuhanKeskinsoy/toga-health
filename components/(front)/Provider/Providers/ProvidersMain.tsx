"use client";
import React from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import ProvidersPaginationWrapper from "@/components/(front)/Provider/Providers/ProvidersPaginationWrapper";
import {
  IoCalendarOutline,
  IoInformationCircleOutline,
  IoSearchOutline,
  IoGlobeOutline,
  IoLocationOutline,
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

  if (!providersSlug) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <IoGlobeOutline className="text-4xl text-blue-600" />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h3 className="text-2xl font-bold text-gray-900">
            Sağlayıcı Bulunamadı
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Aradığınız sağlayıcı bulunamadı
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <div className="animate-spin rounded-full size-10 border-3 border-gray-300 border-t-blue-600"></div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            Sağlayıcılar Yükleniyor
          </h3>
          <p className="text-gray-600">
            Lütfen bekleyin, sağlayıcılar getiriliyor
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
        <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <IoInformationCircleOutline className="text-4xl text-red-600" />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h3 className="text-2xl font-bold text-red-600">
            Hata Oluştu
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {error}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
            <IoInformationCircleOutline className="text-lg" />
            <span>Lütfen sayfayı yenilemeyi deneyin</span>
          </div>
        </div>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <IoSearchOutline className="text-4xl text-gray-500" />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h3 className="text-2xl font-bold text-gray-900">
            Sağlayıcı Bulunamadı
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            Bu kriterlere uygun sağlayıcı bulunamadı. Farklı filtreler deneyebilirsiniz
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
            <IoSearchOutline className="text-lg" />
            <span>Farklı arama terimleri veya filtreler deneyin</span>
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
