import React from "react";
import { IoChevronDown, IoListOutline } from "react-icons/io5";
import ProvidersMain from "@/components/(front)/Provider/Providers/ProvidersMain";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { DiseaseProvidersResponse } from "@/lib/types/categories/diseasesTypes";

interface ProvidersViewProps {
  diseaseSlug?: string;
  diseaseName?: string;
  country?: string;
  city?: string;
  district?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  locale?: string;
  totalProviders?: number;
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
}: ProvidersViewProps) {
  let currentDiseaseName = diseaseName || "";
  let currentTotalProviders = totalProviders || 0;

  // Server-side'da veri çek
  if (diseaseSlug && country) {
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
        currentDiseaseName = response.data.disease.name;
        currentTotalProviders = response.data.providers.summary.total_providers;
      }
    } catch (error) {
      console.error('Error fetching disease data:', error);
    }
  }
  return (
    <div className="flex-1">
      <div className="flex max-lg:flex-col justify-between lg:items-center lg:py-2 py-6 gap-4">
        <div className="flex flex-col gap-1 w-full pl-4 border-l-4 border-sitePrimary">
          <h1 className="text-2xl font-bold">
            {currentDiseaseName
              ? `${currentDiseaseName} İçin Doktorlar ve Hastaneler`
              : "Doktorlar ve Hastaneler"}
          </h1>
          <p className="text-sm text-gray-500">
            {currentDiseaseName && currentTotalProviders > 0
              ? `${currentDiseaseName} için ${currentTotalProviders} sağlayıcı bulundu.`
              : currentDiseaseName
              ? `${currentDiseaseName} için sağlayıcılar bulundu.`
              : "Sağlayıcılar listeleniyor."}
          </p>
        </div>
        <div className="flex items-center gap-2 min-w-max">
          <button className="flex items-center justify-between max-lg:w-full gap-6 bg-white border border-gray-200 px-4 py-3 rounded-md hover:border-sitePrimary transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-start">
              <span className="text-[11px] opacity-80">Sıralama</span>
              <span className="text-xs font-medium text-sitePrimary">
                Akıllı Sıralama
              </span>
            </div>
            <div className="flex items-center justify-center size-8 bg-gray-100 rounded-md">
              <IoChevronDown size={16} className="text-gray-500" />
            </div>
          </button>
          <button className="flex items-center justify-between max-lg:w-full gap-6 bg-white border border-gray-200 px-4 py-3 rounded-md hover:border-sitePrimary transition-all duration-300 cursor-pointer">
            <div className="flex flex-col items-start">
              <span className="text-[11px] opacity-80">Listeleme</span>
              <span className="text-xs font-medium text-sitePrimary">
                Akıllı Listeleme
              </span>
            </div>
            <div className="flex items-center justify-center size-8 bg-gray-100 rounded-md">
              <IoListOutline size={16} className="text-gray-500" />
            </div>
          </button>
        </div>
      </div>
      <ProvidersMain
        diseaseSlug={diseaseSlug}
        country={country}
        city={city}
        district={district}
        locale={locale}
      />
    </div>
  );
}

export default ProvidersView;
