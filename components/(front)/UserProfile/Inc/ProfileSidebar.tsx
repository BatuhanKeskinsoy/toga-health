"use client";
import {
  navLinksAuthCorporate,
  navLinksAuthDoctor,
  navLinksAuthIndividual,
} from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import { showProfessionalAccountTypeSelection } from "@/lib/functions/professionalAccountAlert";
import CustomButton from "@/components/others/CustomButton";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { IoChevronForwardOutline } from "react-icons/io5";
import {
  CorporateProvider,
  DoctorProvider,
} from "@/lib/types/providers/providersTypes";

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
  const path = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const { setSidebarStatus } = useGlobalContext();

  const isActive = (baseUrl: string) => {
    if (!baseUrl || !path) return false;

    // Exact match
    if (path === baseUrl) return true;

    // Alt sayfalar için (ana /profile hariç)
    if (baseUrl !== "/profile" && path.startsWith(baseUrl + "/")) {
      return true;
    }

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
            containerStyles="w-full inline-flex items-center justify-center px-3 py-4 text-sm tracking-wider font-medium rounded-md bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-500 hover:to-blue-500 shadow-md transition-all duration-300"
            title={t("Profesyonel Misiniz?")}
          />
        </div>
      )}

      {/* Profesyonel Tip Seçim Butonu - Sadece individual kullanıcılar için */}
      {user?.user_type !== "individual" && (
        <div className="max-lg:p-4">
          <Link
            className="w-full inline-flex items-center justify-center px-3 py-4 text-sm tracking-wider font-medium rounded-md bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-500 hover:to-blue-500 shadow-md transition-all duration-300"
            title={t("Profile Git")}
            href={
              user?.user_type === "doctor"
                ? getLocalizedUrl("/[...slug]", locale, {
                    slug: [
                      user?.slug,
                      user?.doctor_info.specialty.slug,
                      user?.location.country_slug,
                      user?.location?.city_slug,
                    ].join("/"),
                  })
                : getLocalizedUrl("/hospital/[...slug]", locale, {
                    slug: [
                      user?.slug,
                      (user as CorporateProvider).location?.country_slug,
                      (user as CorporateProvider).location?.city_slug,
                    ].join("/"),
                  })
            }
          >
            {t("Profile Git")}
          </Link>
        </div>
      )}

      <nav className="flex flex-col bg-gray-50 lg:border lg:border-gray-200 lg:rounded-md lg:sticky top-24 lg:overflow-hidden overflow-y-auto max-lg:h-[calc(100dvh-161px)]">
        {links.map((link) => {
          const localized = getLocalizedUrl(link.url, locale);
          const active = isActive(link.url);
          const hasSublinks = !!link.sublinks?.length;
          const hasActiveSublink =
            hasSublinks &&
            link.sublinks!.some((sublink) => isActive(sublink.url));

          return (
            <div
              key={link.url}
              className="border-b border-gray-200 last:border-b-0"
            >
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
                  <span className="*:size-4.5 *:min-w-4.5">{link.icon}</span>
                )}
                <span>{t(link.title)}</span>
              </Link>

              {hasSublinks && (
                <div className="bg-gray-100">
                  {link.sublinks!.map((sublink) => {
                    const sublinkLocalized = getLocalizedUrl(
                      sublink.url,
                      locale
                    );
                    const sublinkActive = isActive(sublink.url);

                    return (
                      <Link
                        key={sublink.url}
                        href={sublinkLocalized}
                        title={t(sublink.title)}
                        onClick={() => setSidebarStatus("")}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 first:border-t border-gray-200 ${
                          sublinkActive
                            ? "bg-sitePrimary text-white"
                            : "text-gray-600 hover:bg-sitePrimary/5 hover:text-sitePrimary"
                        }`}
                      >
                        <IoChevronForwardOutline className="size-4" />
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
