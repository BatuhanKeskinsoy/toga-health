import React from "react";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomSelect from "@/components/others/CustomSelect";
import LocationFilters from "./LocationFilters";
import CategoryFilter from "./CategoryFilter";
import DiseaseFilter from "./DiseaseFilter";
import SelectedFilters from "./SelectedFilters";

interface ProvidersSidebarProps {
  diseaseSlug?: string;
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
  countries?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  cities?: Array<{
    id: number;
    name: string;
    slug: string;
    countrySlug: string;
  }>;
  districts?: Array<{
    id: number;
    name: string;
    slug: string;
    citySlug: string;
  }>;
  locale?: string;
}

function ProvidersSidebar({ 
  diseaseSlug, 
  country, 
  city, 
  district, 
  categoryType = "diseases",
  diseases = [],
  branches = [],
  treatmentsServices = [],
  countries = [],
  cities = [],
  districts = [],
  locale = "tr"
}: ProvidersSidebarProps) {
  
  // Mevcut hastalık bilgisini bul
  const currentDisease = diseases.find(d => d.slug === diseaseSlug);
  
  // Kategori seçenekleri
  const categoryOptions = [
    { id: 1, name: "Hastalıklar", slug: "diseases" },
    { id: 2, name: "Branşlar", slug: "branches" },
    { id: 3, name: "Tedaviler ve Hizmetler", slug: "treatments-services" }
  ];

  const currentCategory = categoryOptions.find(c => c.slug === categoryType);

  // Seçili konum bilgileri
  const selectedLocation = {
    country: country ? countries.find(c => c.slug === country) || { id: 0, name: country, slug: country } : null,
    city: city ? cities.find(c => c.slug === city) || { id: 0, name: city, slug: city, countrySlug: country || "" } : null,
    district: district ? districts.find(d => d.slug === district) || { id: 0, name: district, slug: district, citySlug: city || "" } : null
  };

  return (
    <div className="w-full bg-white rounded-md sticky top-4 p-4 shadow-md shadow-gray-200">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Filtreler</h3>
        
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
            diseaseSlug={diseaseSlug}
            locale={locale}
          />
        )}

        {/* Konum Seçimi */}
        <LocationFilters 
          selectedLocation={selectedLocation}
          countries={countries}
          cities={cities}
          districts={districts}
          locale={locale}
        />

        {/* Seçili Filtreler */}
        <SelectedFilters 
          currentDisease={currentDisease}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

export default ProvidersSidebar;
