"use client";
import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import NextLink from "next/link";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  PopularDisease,
  PopularSpecialty,
  PopularTreatment,
  SettingsResponse,
} from "@/lib/types/settings/settingsTypes";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoMedicalOutline,
} from "react-icons/io5";
import Auth from "@/components/(front)/Inc/Sidebar/Auth/Auth";
import Lang from "@/components/(front)/Inc/Sidebar/Lang/Lang";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePusherContext } from "@/lib/context/PusherContext";
import { UserTypes } from "@/lib/types/user/UserTypes";

interface MobileMenuProps {
  generals?: SettingsResponse;
  user?: UserTypes;
}

function MobileMenu({ generals, user: propUser }: MobileMenuProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { setSidebarStatus } = useGlobalContext();
  const { serverUser: contextServerUser } = usePusherContext();
  const { user: hookUser } = useUser({ serverUser: contextServerUser });
  const user = propUser || hookUser;
  const [activeSection, setActiveSection] = useState<"menu" | "auth" | "lang">(
    "menu"
  );
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get popular data from settings
  const popularSpecialties: PopularSpecialty[] =
    generals?.populer_specialties || [];
  const popularDiseases: PopularDisease[] = generals?.populer_diseases || [];
  const popularTreatments: PopularTreatment[] =
    generals?.populer_treatments || [];

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleLinkClick = () => {
    setSidebarStatus("");
  };

  const renderSpecialtyCard = (specialty: PopularSpecialty) => (
    <Link
      key={specialty.id}
      href={getLocalizedUrl("/branches/[slug]", locale, {
        slug: specialty.slug,
      })}
      onClick={handleLinkClick}
      className="flex items-center gap-3 py-0.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-blue-400 to-blue-700 rounded-md flex items-center justify-center shadow-md">
        <IoMedicalOutline className="text-xl text-white" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-gray-900">{specialty.name}</h3>
        <div className="text-xs text-gray-500">
          {t("Doktorlar")} ({specialty.doctors_count})
        </div>
      </div>
    </Link>
  );

  const renderDiseaseCard = (disease: PopularDisease) => (
    <Link
      key={disease.id}
      href={getLocalizedUrl("/diseases/[slug]", locale, {
        slug: disease.slug,
      })}
      onClick={handleLinkClick}
      className="flex items-center gap-3 py-0.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-red-400 to-red-700 rounded-md flex items-center justify-center shadow-md">
        <IoMedicalOutline className="text-xl text-white" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-gray-900">{disease.name}</h3>
        <div className="text-xs text-gray-500">
          {t("Doktorlar")} ({disease.doctors_count}) / {t("Hastaneler")} (
          {disease.corporates_count})
        </div>
      </div>
    </Link>
  );

  const renderTreatmentCard = (treatment: PopularTreatment) => (
    <Link
      key={treatment.id}
      href={getLocalizedUrl("/treatments-services/[slug]", locale, {
        slug: treatment.slug,
      })}
      onClick={handleLinkClick}
      className="flex items-center gap-3 py-0.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-green-400 to-green-700 rounded-md flex items-center justify-center shadow-md">
        <IoMedicalOutline className="text-xl text-white" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <h3 className="text-sm font-medium text-gray-900">{treatment.name}</h3>
        <div className="text-xs text-gray-500">
          {t("Doktorlar")} ({treatment.doctors_count}) / {t("Hastaneler")} (
          {treatment.corporates_count})
        </div>
      </div>
    </Link>
  );

  if (activeSection === "auth") {
    return (
      <div className="flex flex-col h-[calc(100dvh-77px)]">
        <div className="flex-1 overflow-y-auto">
          <Auth />
        </div>
      </div>
    );
  }

  if (activeSection === "lang") {
    return (
      <div className="flex flex-col h-[calc(100dvh-77px)]">
        <div className="flex-1 overflow-y-auto">
          <Lang />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-77px)] overflow-y-auto">
      {/* Ana Menü Linkleri */}
      <div className="flex flex-col">
        {/* Branşlar */}
        <div className="border-b border-gray-200">
          <Link
            href={getLocalizedUrl("/branches", locale)}
            onClick={handleLinkClick}
            className="px-4 py-4 flex items-center justify-between text-base font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            <span>{t("Branşlar")}</span>
            <IoChevronForwardOutline className="text-xl rtl:rotate-180" />
          </Link>
          {popularSpecialties.length > 0 && (
            <button
              onClick={() => toggleExpanded("branches")}
              className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <span>{t("Popüler Branşlar")}</span>
              <IoChevronDownOutline
                className={`text-lg transition-transform duration-200 ${
                  expandedItems.includes("branches") ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
          {expandedItems.includes("branches") &&
            popularSpecialties.length > 0 && (
              <>
                <hr className="border-gray-200 mb-2" />
                <div className="px-4 pb-4 space-y-2">
                  {popularSpecialties.slice(0, 7).map(renderSpecialtyCard)}
                  <Link
                    href={getLocalizedUrl("/branches", locale)}
                    onClick={handleLinkClick}
                    className="block text-center text-sm font-medium text-sitePrimary hover:text-sitePrimary/80 transition-colors duration-200 pt-2"
                  >
                    {t("Tüm Branşları Gör")}
                  </Link>
                </div>
              </>
            )}
        </div>

        {/* Hastalıklar */}
        <div className="border-b border-gray-200">
          <Link
            href={getLocalizedUrl("/diseases", locale)}
            onClick={handleLinkClick}
            className="px-4 py-4 flex items-center justify-between text-base font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            <span>{t("Hastalıklar")}</span>
            <IoChevronForwardOutline className="text-xl rtl:rotate-180" />
          </Link>
          {popularDiseases.length > 0 && (
            <button
              onClick={() => toggleExpanded("diseases")}
              className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <span>{t("Popüler Hastalıklar")}</span>
              <IoChevronDownOutline
                className={`text-lg transition-transform duration-200 ${
                  expandedItems.includes("diseases") ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
          {expandedItems.includes("diseases") && popularDiseases.length > 0 && (
            <>
              <hr className="border-gray-200 my-2" />
              <div className="px-4 pb-4 space-y-2">
                {popularDiseases.slice(0, 7).map(renderDiseaseCard)}
                <Link
                  href={getLocalizedUrl("/diseases", locale)}
                  onClick={handleLinkClick}
                  className="block text-center text-sm font-medium text-sitePrimary hover:text-sitePrimary/80 transition-colors duration-200 pt-2"
                >
                  {t("Tüm Hastalıkları Gör")}
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Tedaviler */}
        <div className="border-b border-gray-200">
          <Link
            href={getLocalizedUrl("/treatments-services", locale)}
            onClick={handleLinkClick}
            className="px-4 py-4 flex items-center justify-between text-base font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            <span>{t("Tedaviler ve Hizmetler")}</span>
            <IoChevronForwardOutline className="text-xl rtl:rotate-180" />
          </Link>
          {popularTreatments.length > 0 && (
            <button
              onClick={() => toggleExpanded("treatments")}
              className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <span>{t("Popüler Tedaviler ve Hizmetler")}</span>
              <IoChevronDownOutline
                className={`text-lg transition-transform duration-200 ${
                  expandedItems.includes("treatments") ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
          {expandedItems.includes("treatments") &&
            popularTreatments.length > 0 && (
              <>
                <hr className="border-gray-200 mb-2" />
                <div className="px-4 pb-4 space-y-2">
                  {popularTreatments.slice(0, 7).map(renderTreatmentCard)}
                  <Link
                    href={getLocalizedUrl("/treatments-services", locale)}
                    onClick={handleLinkClick}
                    className="block text-center text-sm font-medium text-sitePrimary hover:text-sitePrimary/80 transition-colors duration-200 pt-2"
                  >
                    {t("Tüm Tedaviler ve Hizmetleri Gör")}
                  </Link>
                </div>
              </>
            )}
        </div>

        {/* Blog */}
        <NextLink
          href="https://blog.togahh.com/"
          onClick={handleLinkClick}
          className="px-4 py-4 border-b border-gray-200 flex items-center justify-between text-base font-medium hover:bg-gray-50 transition-colors duration-200"
          rel="noopener noreferrer noindex nofollow"
        >
          <span>{t("Blog")}</span>
          <IoChevronForwardOutline className="text-xl rtl:rotate-180" />
        </NextLink>
      </div>

      {/* Login ve Dil Seçimi Butonları */}
      <div className="mt-auto pt-4 border-t border-gray-200 space-y-2 px-4 pb-4">
        {user ? (
          <button
            onClick={() => setActiveSection("auth")}
            className="w-full px-4 py-3 bg-sitePrimary text-white rounded-lg font-medium hover:bg-sitePrimary/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>
              {user.expert_title ? `${user.expert_title} ` : ""}
              {user.name}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveSection("auth")}
            className="w-full px-4 py-3 bg-sitePrimary text-white rounded-lg font-medium hover:bg-sitePrimary/90 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>{t("Giriş Yap")}</span>
          </button>
        )}
        <button
          onClick={() => setActiveSection("lang")}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span className="uppercase">{locale}</span>
          <span>{t("Dil Seçimi")}</span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(MobileMenu);
