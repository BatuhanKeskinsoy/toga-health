"use client";
import {
  navLinksAuthCorporate,
  navLinksAuthDoctor,
  navLinksAuthIndividual,
} from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo } from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import { showProfessionalAccountTypeSelection } from "@/lib/functions/professionalAccountAlert";
import CustomButton from "@/components/others/CustomButton";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { IoChevronForwardOutline } from "react-icons/io5";

type Props = {
  user: UserTypes | null;
};

type NavLink = {
  icon?: React.ReactElement;
  title: string;
  url: string;
  sublinks?: NavLink[];
};

export default function ProfileSidebar({ user }: Props) {
  const path = usePathname(); // Next-intl'in usePathname hook'u base URL döndürür
  const t = useTranslations();
  const locale = useLocale();
  const { setSidebarStatus } = useGlobalContext();

  // usePathname zaten base URL döndürür, state'e gerek yok
  // const [currentPath, setCurrentPath] = useState<string>(path || "");

  const isActive = (baseUrl: string) => {
    // Null/undefined kontrolü
    if (!baseUrl || !path) return false;

    // Exact match kontrolü
    if (path === baseUrl) return true;

    // Ana sayfa kontrolü - /profile için sadece exact match
    const isMainProfilePage = baseUrl === "/profile";
    if (isMainProfilePage) {
      return path === "/profile";
    }

    // Alt sayfalar için starts with kontrolü
    if (path.startsWith(baseUrl + "/")) return true;

    return false;
  };

  const links = useMemo<NavLink[]>(() => {
    const type = user?.user_type || "individual";
    if (type === "doctor") {
      return navLinksAuthDoctor.flatMap((group) => group.links) as NavLink[];
    }
    if (type === "corporate") {
      return navLinksAuthCorporate.flatMap((group) => group.links) as NavLink[];
    }
    return navLinksAuthIndividual.flatMap((group) => group.links) as NavLink[];
  }, [user?.user_type]);

  return (
    <div className="flex flex-col lg:gap-4">
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
          const active = isActive(link.url); // Base URL kullan
          const hasSublinks = link.sublinks && link.sublinks.length > 0;

          // Alt linklerden herhangi biri aktif mi kontrol et
          const hasActiveSublink =
            hasSublinks &&
            link.sublinks!.some((sublink: NavLink) => {
              return isActive(sublink.url); // Base URL kullan
            });

          return (
            <div
              key={`${link.url}-${index}`}
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Ana Link */}
              <Link
                href={localized}
                title={t(link.title)}
                onClick={() => setSidebarStatus("")}
                className={`flex items-center gap-2.5 px-4 py-3 text-base transition-all duration-200 ${
                  active
                    ? "bg-sitePrimary text-white"
                    : hasActiveSublink
                    ? "bg-sitePrimary/10 text-sitePrimary"
                    : "text-gray-700 hover:bg-sitePrimary/5 hover:text-sitePrimary"
                }`}
              >
                {link.icon && (
                  <span className="*:size-4.5 *:min-w-4.5 -mt-0.5">
                    {link.icon}
                  </span>
                )}
                <span>{t(link.title)}</span>
              </Link>

              {/* Alt Linkler */}
              {hasSublinks && (
                <div className="bg-gray-100">
                  {link.sublinks!.map((sublink: NavLink, subIndex: number) => {
                    const sublinkLocalized =
                      getLocalizedUrl(sublink.url, locale) || sublink.url;
                    const sublinkActive = isActive(sublink.url); // Base URL kullan

                    return (
                      <Link
                        key={`${sublink.url}-${subIndex}`}
                        href={sublinkLocalized}
                        title={t(sublink.title)}
                        onClick={() => setSidebarStatus("")}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 first:border-t border-gray-200 ${
                          sublinkActive
                            ? "bg-sitePrimary text-white"
                            : "text-gray-600 hover:bg-sitePrimary/5 hover:text-sitePrimary"
                        }`}
                      >
                        <IoChevronForwardOutline className="size-4 -mt-0.5" />
                        <span>{t(sublink.title)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
