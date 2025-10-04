"use client";
import {
  navLinksAuthCorporate,
  navLinksAuthDoctor,
  navLinksAuthIndividual,
} from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo, useState, useEffect } from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import { showProfessionalAccountTypeSelection } from "@/lib/functions/professionalAccountAlert";
import CustomButton from "@/components/others/CustomButton";
import { useGlobalContext } from "@/app/Context/GlobalContext";

type Props = {
  user: UserTypes | null;
};

export default function ProfileSidebar({ user }: Props) {
  const path = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const [currentPath, setCurrentPath] = useState<string>(path || "");
  const { setSidebarStatus } = useGlobalContext();

  // Path değişikliklerini dinle
  useEffect(() => {
    const updatePath = () => {
      if (typeof window !== "undefined") {
        const fullPath = window.location.pathname;
        const pathWithoutLocale = fullPath.replace(/^\/[a-z]{2}\//, "/");
        setCurrentPath(pathWithoutLocale);
      }
    };

    // İlk yüklemede path'i güncelle
    updatePath();

    // Popstate event'ini dinle (geri/ileri butonları için)
    window.addEventListener("popstate", updatePath);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  // usePathname değiştiğinde de güncelle
  useEffect(() => {
    if (path) {
      setCurrentPath(path);
    }
  }, [path]);

  const isActive = (localizedUrl: string) => {
    // Null/undefined kontrolü
    if (!localizedUrl || !currentPath) return false;
    
    // Locale'siz path'leri al
    const currentPathClean = currentPath.replace(/^\/[a-z]{2}\//, "/");
    const localizedUrlClean = localizedUrl.replace(/^\/[a-z]{2}\//, "/");

    // Exact match kontrolü
    if (currentPathClean === localizedUrlClean) return true;

    // Ana sayfa kontrolü - /profile ve /profil için sadece exact match
    const isMainProfilePage =
      localizedUrlClean === "/profile" || localizedUrlClean === "/profil";

    if (isMainProfilePage) {
      // Ana sayfa için sadece exact match
      return currentPathClean === "/profile" || currentPathClean === "/profil";
    }

    // Alt sayfalar için starts with kontrolü
    if (currentPathClean.startsWith(localizedUrlClean + "/")) return true;

    // Dil çevirileri için URL mapping
    const urlMappings: Record<string, string> = {
      "/profile": "/profil",
      "/profile/appointments": "/profil/randevularim",
      "/profile/messages": "/profil/mesajlarim",
      "/profile/details": "/profil/detaylar",
      "/profil": "/profile",
      "/profil/randevularim": "/profile/appointments",
      "/profil/mesajlarim": "/profile/messages",
      "/profil/detaylar": "/profile/details",
    };

    // Mapping ile karşılaştırma
    const mappedCurrentPath = urlMappings[currentPathClean] || currentPathClean;
    const mappedLocalizedUrl =
      urlMappings[localizedUrlClean] || localizedUrlClean;

    if (
      mappedCurrentPath === localizedUrlClean ||
      currentPathClean === mappedLocalizedUrl
    ) {
      return true;
    }

    // Alt sayfalar için mapping ile starts with kontrolü
    if (
      mappedCurrentPath.startsWith(localizedUrlClean + "/") ||
      currentPathClean.startsWith(mappedLocalizedUrl + "/")
    ) {
      return true;
    }

    return false;
  };

  const links = useMemo(() => {
    const type = user?.user_type || "individual";
    if (type === "doctor") {
      // Doctor links are grouped, flatten them
      return navLinksAuthDoctor.flatMap(group => group.links);
    }
    if (type === "corporate") {
      // Corporate links are grouped, flatten them
      return navLinksAuthCorporate.flatMap(group => group.links);
    }
    // Individual links are now grouped, flatten them
    return navLinksAuthIndividual.flatMap(group => group.links);
  }, [user?.user_type]);

  return (
    <div className="flex flex-col lg:gap-2">
      {/* Profesyonel Tip Seçim Butonu - Sadece individual kullanıcılar için */}
      {user?.user_type === "individual" && (
        <div className="max-lg:p-4">
          <CustomButton
            handleClick={showProfessionalAccountTypeSelection}
            containerStyles="w-full z-10 inline-flex items-center justify-center px-3 py-4 text-sm tracking-wider font-medium rounded-md bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-500 hover:to-blue-500 shadow-md transition-all duration-300"
            title={t("Profesyonel Misiniz?")}
          />
        </div>
      )}

      <nav className="flex flex-col bg-gray-50 lg:border lg:border-gray-200 lg:rounded-md lg:sticky top-24 lg:overflow-hidden overflow-y-auto max-lg:h-[calc(100dvh-161px)]">
        {links.map((link, index) => {
          const localized = getLocalizedUrl(link.url, locale) || link.url;
          const active = isActive(localized);

          return (
            <Link
              key={`${link.url}-${index}`}
              href={localized}
              title={t(link.title)}
              onClick={() => setSidebarStatus("")}
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[16px] transition-all duration-200 ${
                active
                  ? "bg-sitePrimary text-white"
                  : "text-gray-700 hover:bg-sitePrimary/5 hover:text-sitePrimary"
              }`}
            >
              {link.icon && <span className="text-base min-w-4">{link.icon}</span>}
              {t(link.title)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
