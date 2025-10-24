"use client";

import React, { useState, useEffect } from "react";
import LocationFilters from "@/components/(front)/Provider/Providers/ProbidersSidebar/LocationFilters";
import CategoryFilter from "@/components/(front)/Provider/Providers/ProbidersSidebar/CategoryFilter";
import DiseaseFilter from "@/components/(front)/Provider/Providers/ProbidersSidebar/DynamicFilters/DiseaseFilter";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { useTranslations } from "next-intl";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import CustomInput from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import { IoSearch, IoClose, IoSearchOutline } from "react-icons/io5";
import BranchesFilter from "./DynamicFilters/BranchesFilter";
import TreatmentsFilter from "./DynamicFilters/TreatmentsFilter";

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
  currentPath,
}: ProvidersSidebarContentProps) {
  const t = useTranslations();
  const { setSidebarStatus } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Arama fonksiyonu artık sadece state'i günceller
    // Parent component'e search query'yi iletmek için custom event gönder
    window.dispatchEvent(new CustomEvent('providerSearch', { 
      detail: { searchQuery: searchQuery.trim() } 
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // Temizleme için de custom event gönder
    window.dispatchEvent(new CustomEvent('providerSearch', { 
      detail: { searchQuery: "" } 
    }));
  };

  // Mevcut hastalık bilgisini bul
  const currentDisease = categoryType === "diseases" 
    ? diseases.find((d) => d?.slug === providersSlug) 
    : null;
  const currentBranch = categoryType === "branches" 
    ? branches.find((b) => b?.slug === providersSlug) 
    : null;
  const currentTreatmentService = categoryType === "treatments-services" 
    ? treatmentsServices.find((t) => t?.slug === providersSlug) 
    : null;

  // Kategori seçenekleri
  const categoryOptions = [
    { id: 1, name: t("Hastalıklar"), slug: "diseases" },
    { id: 2, name: t("Branşlar"), slug: "branches" },
    { id: 3, name: t("Tedaviler ve Hizmetler"), slug: "treatments-services" },
  ];

  const currentCategory = categoryOptions.find((c) => c.slug === categoryType);

  // Seçili konum bilgileri
  const selectedLocation = {
    country: country ? countries.find((c) => c?.slug === country) || null : null,
    city: city ? cities.find((c) => c?.slug === city) || null : null,
    district: district
      ? districts.find((d) => d?.slug === district) || null
      : null,
  };

  return (
    <div className="flex flex-col gap-4 max-lg:p-4">
      {/* Arama */}
      <div className="flex gap-2 w-full">
        <div className="relative w-full *:py-1">
          <CustomInput
            id="search"
            type="text"
            name="search"
            value={searchQuery}
            label={t("Uzman Ara")}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoClose size={20} />
            </button>
          )}
        </div>
        <CustomButton
          handleClick={handleSearch}
          leftIcon={<IoSearch className="text-lg" />}
          textStyles="text-sm font-medium"
          containerStyles="px-4 py-3.5 text-xs bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/80 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          isDisabled={!searchQuery.trim()}
        />
      </div>
      <hr className="border-gray-200" />
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
          currentDisease={currentDisease || null}
          diseases={diseases}
          diseaseSlug={providersSlug}
          locale={locale}
          currentPath={currentPath}
        />
      )}

      {/* Branş Seçimi (sadece branşlar sayfasında) */}
      {categoryType === "branches" && (
        <BranchesFilter
          currentBranch={currentBranch || null}
          branches={branches}
          branchSlug={providersSlug}
          locale={locale}
          currentPath={currentPath}
        />
      )}

      {/* Branş Seçimi (sadece branşlar sayfasında) */}
      {categoryType === "treatments-services" && (
        <TreatmentsFilter
          currentTreatmentService={currentTreatmentService || null}
          treatmentsServices={treatmentsServices}
          treatmentServiceSlug={providersSlug}
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
