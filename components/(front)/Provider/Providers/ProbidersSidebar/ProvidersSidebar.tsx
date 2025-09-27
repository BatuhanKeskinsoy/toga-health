"use client";
import React from "react";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { useTranslations } from "next-intl";
import { IoFilter } from "react-icons/io5";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import ProvidersSidebarContent from "./ProvidersSidebarContent";

interface ProvidersSidebarProps {
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

function ProvidersSidebar({ 
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
}: ProvidersSidebarProps) {
  const t = useTranslations();
  const { setSidebarStatus, setProvidersSidebarData } = useGlobalContext();

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden w-full mt-4 px-4">
        <button
          onClick={() => {
            setProvidersSidebarData({
              providersSlug,
              country,
              city,
              district,
              categoryType,
              diseases,
              branches,
              treatmentsServices,
              countries,
              cities,
              districts,
              locale,
              currentPath
            });
            setSidebarStatus("Filter");
          }}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2">
            <IoFilter className="text-gray-600" size={16} />
            <span className="font-medium text-sm leading-4 text-gray-900">{t("Filtreler")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {country && `${countries.find(c => c.slug === country)?.name || country}`}
              {city && `, ${cities.find(c => c.slug === city)?.name || city}`}
              {district && `, ${districts.find(d => d.slug === district)?.name || district}`}
            </span>
          </div>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full bg-white rounded-md sticky top-4 p-4 shadow-md shadow-gray-200">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">{t("Filtreler")}</h3>
          
          <ProvidersSidebarContent
            country={country}
            city={city}
            district={district}
            categoryType={categoryType}
            diseases={diseases}
            branches={branches}
            treatmentsServices={treatmentsServices}
            countries={countries}
            cities={cities}
            districts={districts}
            locale={locale}
            currentPath={currentPath}
          />
        </div>
      </div>
    </>
  );
}

export default ProvidersSidebar;
