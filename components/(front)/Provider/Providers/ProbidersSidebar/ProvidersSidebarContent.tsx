"use client";

import React from "react";
import LocationFilters from "@/components/(front)/Provider/Providers/ProbidersSidebar/LocationFilters";
import CategoryFilter from "@/components/(front)/Provider/Providers/ProbidersSidebar/CategoryFilter";
import DiseaseFilter from "@/components/(front)/Provider/Providers/ProbidersSidebar/DiseaseFilter";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { useTranslations } from "next-intl";
import { useGlobalContext } from "@/app/Context/GlobalContext";

interface ProvidersSidebarContentProps {
  providersSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
  // Server-side'dan gelen veriler
  diseases?: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  branches?: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  treatmentsServices?: Array<{
    id: number;
    name: string;
    title: string;
    slug: string;
  }>;
  countries?: Country[];
  cities?: City[];
  districts?: District[];
  locale?: string;
  currentPath: string;
}

function ProvidersSidebarContent({ 
  providersSlug, 
  country, 
  city, 
  district, 
  categoryType,
  diseases = [],
  branches = [],
  treatmentsServices = [],
  countries = [],
  cities = [],
  districts = [],
  locale = "tr",
  currentPath
}: ProvidersSidebarContentProps) {
  const t = useTranslations();
  const { setSidebarStatus } = useGlobalContext();
  
  // Mevcut hastalık bilgisini bul
  const currentDisease = diseases.find(d => d.slug === providersSlug);
  
  // Kategori seçenekleri
  const categoryOptions = [
    { id: 1, name: t("Hastalıklar"), slug: "diseases" },
    { id: 2, name: t("Branşlar"), slug: "branches" },
    { id: 3, name: t("Tedaviler ve Hizmetler"), slug: "treatments-services" }
  ];

  const currentCategory = categoryOptions.find(c => c.slug === categoryType);

  // Seçili konum bilgileri
  const selectedLocation = {
    country: country ? countries.find(c => c.slug === country) || null : null,
    city: city ? cities.find(c => c.slug === city) || null : null,
    district: district ? districts.find(d => d.slug === district) || null : null
  };

  return (
    <div className="flex flex-col gap-4 max-lg:p-4">
      {/* Kategori Seçimi */}
      <CategoryFilter 
        currentCategory={currentCategory}
        categoryOptions={categoryOptions}
        categoryType={categoryType}
        locale={locale}
      />

      {/* Hastalık Seçimi (sadece hastalıklar sayfasında) */}
      {categoryType === "diseases" && (
        <DiseaseFilter 
          currentDisease={currentDisease}
          diseases={diseases}
          diseaseSlug={providersSlug}
          locale={locale}
          currentPath={currentPath}
        />
      )}

      {/* Konum Seçimi */}
      <LocationFilters 
        selectedLocation={selectedLocation}
        countries={countries}
        cities={cities}
        districts={districts}
        locale={locale}
        currentPath={currentPath}
        onFilterChange={() => setSidebarStatus("")}
      />
    </div>
  );
}

export default ProvidersSidebarContent;
