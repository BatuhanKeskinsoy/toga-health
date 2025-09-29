"use client";
import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { IoChevronDownOutline, IoMedicalOutline } from "react-icons/io5";

interface HeaderNavigationProps {
  generals?: SettingsResponse;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ generals }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Get popular data from settings
  const popularSpecialties = generals?.populer_specialties || [];
  const popularDiseases = generals?.populer_diseases || [];
  const popularTreatments = generals?.populer_treatments || [];

  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const renderSpecialtyCard = (specialty: any) => (
    <Link
      key={specialty.id}
      href={getLocalizedUrl("/branches/[slug]", locale, {
        slug: specialty.slug,
      })}
      className="relative items-center flex gap-2 transition-all duration-300 hover:-translate-y-1 h-full group"
      aria-label={`${specialty.name} branşını görüntüle`}
    >
      <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
        <IoMedicalOutline className="text-2xl text-white " />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-1">
          {specialty.name}
        </h3>
        <div className="text-xs font-medium">
          {specialty.doctors_count} doktor
        </div>
      </div>
    </Link>
  );

  const renderDiseaseCard = (disease: any) => (
    <Link
      key={disease.id}
      href={getLocalizedUrl("/diseases/[slug]", locale, {
        slug: disease.slug,
      })}
      className="relative items-center flex gap-2 transition-all duration-300 hover:-translate-y-1 h-full group"
      aria-label={`${disease.name} hastalığını görüntüle`}
    >
      <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-red-400 to-red-700 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
        <IoMedicalOutline className="text-2xl text-white " />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-700 transition-colors duration-300 line-clamp-1">
          {disease.name}
        </h3>
        <div className="text-xs font-medium">
          {disease.doctors_count} doktor
        </div>
      </div>
    </Link>
  );

  const renderTreatmentCard = (treatment: any) => (
    <Link
      key={treatment.id}
      href={getLocalizedUrl("/treatments-services/[slug]", locale, {
        slug: treatment.slug,
      })}
      className="relative items-center flex gap-2 transition-all duration-300 hover:-translate-y-1 h-full group"
      aria-label={`${treatment.name} tedavisini görüntüle`}
    >
      <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-green-400 to-green-700 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
        <IoMedicalOutline className="text-2xl text-white " />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-1">
          {treatment.name}
        </h3>
        <div className="text-xs font-medium">
          {treatment.doctors_count} doktor
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative flex max-lg:hidden justify-center w-full items-center h-full">
      <ul className="flex items-center justify-center h-full w-full px-8">
        {/* Branşlar Dropdown */}
        <li className="h-full flex items-center justify-center">
          <Link
            href={getLocalizedUrl("/", locale)}
            title={t("Anasayfa")}
            className="flex items-center gap-2 transition-all h-full duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
          >
            {t("Anasayfa")}
          </Link>
        </li>
        <li
          className="h-full flex items-center justify-center"
          onMouseEnter={() => handleMouseEnter("branches")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={getLocalizedUrl("/branches", locale)}
            title={t("Branşlar")}
            className="flex items-center gap-2 transition-all h-full duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
          >
            {t("Branşlar")}
            <IoChevronDownOutline className="text-sm" />
          </Link>
        </li>

        {/* Hastalıklar Dropdown */}
        <li
          className="h-full flex items-center justify-center"
          onMouseEnter={() => handleMouseEnter("diseases")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={getLocalizedUrl("/diseases", locale)}
            title={t("Hastalıklar")}
            className="flex items-center gap-2 transition-all h-full duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
          >
            {t("Hastalıklar")}
            <IoChevronDownOutline className="text-sm" />
          </Link>
        </li>

        {/* Tedaviler Dropdown */}
        <li
          className="h-full flex items-center justify-center"
          onMouseEnter={() => handleMouseEnter("treatments")}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={getLocalizedUrl("/treatments-services", locale)}
            title={t("Tedaviler ve Hizmetler")}
            className="flex items-center gap-2 transition-all h-full duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
          >
            {t("Tedaviler ve Hizmetler")}
            <IoChevronDownOutline className="text-sm" />
          </Link>
        </li>
      </ul>

      {/* Single Absolute Dropdown Container */}
      {activeDropdown && (
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-full bg-white rounded-b-md shadow-xl border border-gray-200 z-20"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4">
            {/* Branşlar Content */}
            {activeDropdown === "branches" && popularSpecialties.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Popüler Branşlar
                </h3>
                <hr className="border-gray-200" />
                <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                  {popularSpecialties.map((specialty) =>
                    renderSpecialtyCard(specialty)
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={getLocalizedUrl("/branches", locale)}
                    className="block text-center text-sm font-medium text-sitePrimary hover:text-sitePrimary/80 transition-colors duration-200"
                  >
                    Tüm Branşları Gör
                  </Link>
                </div>
              </div>
            )}

            {/* Hastalıklar Content */}
            {activeDropdown === "diseases" && popularDiseases.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Popüler Hastalıklar
                </h3>
                <hr className="border-gray-200" />
                <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                  {popularDiseases.map((disease) => renderDiseaseCard(disease))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={getLocalizedUrl("/diseases", locale)}
                    className="block text-center text-sm font-medium text-sitePrimary hover:text-sitePrimary/80 transition-colors duration-200"
                  >
                    Tüm Hastalıkları Gör
                  </Link>
                </div>
              </div>
            )}

            {/* Tedaviler Content */}
            {activeDropdown === "treatments" &&
              popularTreatments.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Popüler Tedaviler ve Hizmetler
                  </h3>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-4 gap-x-2 gap-y-5">
                    {popularTreatments.map((treatment) =>
                      renderTreatmentCard(treatment)
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Link
                      href={getLocalizedUrl("/treatments-services", locale)}
                      className="block text-center text-sm font-medium text-sitePrimary hover:text-sitePrimary/80 transition-colors duration-200"
                    >
                      Tüm Tedaviler ve Hizmetleri Gör
                    </Link>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNavigation;
