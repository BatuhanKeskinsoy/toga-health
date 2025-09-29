"use client";
import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { IoChevronDownOutline } from "react-icons/io5";

interface HeaderNavigationProps {
  generals?: SettingsResponse;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ generals }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Get popular data from settings
  const popularSpecialties = generals?.populer_specialties?.slice(0, 8) || [];
  const popularDiseases = generals?.populer_diseases?.slice(0, 8) || [];
  const popularTreatments = generals?.populer_treatments?.slice(0, 8) || [];

  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <ul className="relative flex max-lg:hidden justify-center w-full items-center h-full">
      {/* Branşlar Dropdown */}
      <li
        className="h-full flex items-center justify-center"
        onMouseEnter={() => handleMouseEnter("branches")}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={getLocalizedUrl("/branches", locale)}
          title={t("Branşlar")}
          className="flex items-center gap-1 transition-all duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
        >
          {t("Branşlar")}
          <IoChevronDownOutline className="text-sm" />
        </Link>

        {activeDropdown === "branches" && popularSpecialties.length > 0 && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Popüler Branşlar
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularSpecialties.map((specialty) => (
                  <Link
                    key={specialty.id}
                    href={getLocalizedUrl("/branches/[slug]", locale, {
                      slug: specialty.slug,
                    })}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sitePrimary rounded-md transition-colors duration-200"
                  >
                    {specialty.name}
                  </Link>
                ))}
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
          </div>
        )}
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
          className="flex items-center gap-1 transition-all duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
        >
          {t("Hastalıklar")}
          <IoChevronDownOutline className="text-sm" />
        </Link>

        {activeDropdown === "diseases" && popularDiseases.length > 0 && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Popüler Hastalıklar
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularDiseases.map((disease) => (
                  <Link
                    key={disease.id}
                    href={getLocalizedUrl("/diseases/[slug]", locale, {
                      slug: disease.slug,
                    })}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sitePrimary rounded-md transition-colors duration-200"
                  >
                    {disease.name}
                  </Link>
                ))}
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
          </div>
        )}
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
          className="flex items-center gap-1 transition-all duration-300 px-3 py-2 hover:text-sitePrimary font-medium"
        >
          {t("Tedaviler ve Hizmetler")}
          <IoChevronDownOutline className="text-sm" />
        </Link>

        {activeDropdown === "treatments" && popularTreatments.length > 0 && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-full">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Popüler Tedaviler ve Hizmetler
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularTreatments.map((treatment) => (
                  <Link
                    key={treatment.id}
                    href={getLocalizedUrl(
                      "/treatments-services/[slug]",
                      locale,
                      { slug: treatment.slug }
                    )}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sitePrimary rounded-md transition-colors duration-200"
                  >
                    {treatment.name}
                  </Link>
                ))}
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
          </div>
        )}
      </li>
    </ul>
  );
};

export default HeaderNavigation;
