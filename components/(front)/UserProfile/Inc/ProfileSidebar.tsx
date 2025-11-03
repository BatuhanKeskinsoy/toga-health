"use client";
import {
  navLinksAuthCorporate,
  navLinksAuthDoctor,
  navLinksAuthIndividual,
} from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import CustomButton from "@/components/Customs/CustomButton";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { IoChevronForwardOutline, IoPaperPlaneOutline } from "react-icons/io5";
import ProfileStatusBanner from "./ProfileStatusBanner";
import ProfessionalAccountTypeSelection from "../ProfessionalAccount/ProfessionalAccountTypeSelection";
import CountryRequiredModal from "../ProfessionalAccount/CountryRequiredModal";
import DoctorApplicationForm from "../ProfessionalAccount/DoctorApplicationForm";
import CorporateApplicationForm from "../ProfessionalAccount/CorporateApplicationForm";

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
  
  const [isProfessionalAccountModalOpen, setIsProfessionalAccountModalOpen] = useState(false);
  const [isCountryRequiredModalOpen, setIsCountryRequiredModalOpen] = useState(false);
  const [isDoctorFormOpen, setIsDoctorFormOpen] = useState(false);
  const [isCorporateFormOpen, setIsCorporateFormOpen] = useState(false);

  const handleProfessionalAccountClick = () => {
    // Kullanıcının ülke bilgisi olup olmadığını kontrol et
    if (!user?.location?.country_slug || !user.location.country) {
      setIsCountryRequiredModalOpen(true);
      return;
    }

    // Ülke bilgisi varsa modal'ı aç
    setIsProfessionalAccountModalOpen(true);
  };

  const handleSelectDoctor = () => {
    setIsProfessionalAccountModalOpen(false);
    setIsDoctorFormOpen(true);
  };

  const handleSelectCorporate = () => {
    setIsProfessionalAccountModalOpen(false);
    setIsCorporateFormOpen(true);
  };

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
      return navLinksAuthDoctor.flatMap((link) => link) as NavLink[];
    }
    if (type === "corporate") {
      return navLinksAuthCorporate.flatMap((link) => link) as NavLink[];
    }
    return navLinksAuthIndividual.flatMap((link) => link) as NavLink[];
  }, [user?.user_type]);

  return (
    <div className="flex flex-col lg:gap-4">
      {/* Profesyonel Tip Seçim Butonu - Sadece individual kullanıcılar için */}
      {user?.user_type === "individual" && (
        <CustomButton
          handleClick={handleProfessionalAccountClick}
          containerStyles="w-full inline-flex items-center justify-center px-3 lg:py-3 py-4 text-sm tracking-wider lg:rounded-md bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-500 hover:to-blue-500 lg:shadow-lg transition-colors duration-300"
          title={t("Profesyonel Misiniz?")}
        />
      )}

      {/* Profesyonel Profil Link Butonu - Sadece doctor ve corporate için */}
      {user?.user_type !== "individual" && (
        <Link
          className="w-full inline-flex items-center justify-between px-5 py-3 max-lg:py-4 text-sm tracking-wider lg:rounded-md bg-gradient-to-r from-green-600 to-green-600/60 text-white hover:to-green-600 lg:shadow-lg transition-colors duration-300"
          title={t("Profile Git")}
          href={
            user?.user_type === "doctor"
              ? getLocalizedUrl("/[...slug]", locale, {
                  slug: [
                    user.slug,
                    // @ts-ignore - Runtime'da doctor_info mevcut
                    user.doctor_info?.specialty?.slug || "",
                    user.location?.country_slug,
                    user.location?.city_slug,
                  ].join("/"),
                })
              : getLocalizedUrl("/hospital/[...slug]", locale, {
                  slug: [
                    user.slug,
                    user.location?.country_slug,
                    user.location?.city_slug,
                  ].join("/"),
                })
          }
          target="_blank"
        >
          <span>{t("Profile Git")}</span>
          <IoPaperPlaneOutline className="size-5" />
        </Link>
      )}

      <nav
        className={`flex flex-col bg-gray-50 lg:border lg:border-gray-200 lg:rounded-md lg:overflow-hidden overflow-y-auto lg:shadow-lg ${
          user?.user_type === "individual" && user?.user_type_change
            ? "max-lg:h-[calc(100dvh-237px)]"
            : "max-lg:h-[calc(100dvh-137px)]"
        }`}
      >
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
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all first:border-t border-b duration-200 last:border-b-0 border-gray-200 ${
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

      {/* Profesyonel Profil Status Banner - Sadece individual kullanıcılar için */}
      {(user?.user_type === "individual" && user?.user_type_change && user?.user_type_change.status !== "approved") && (
        <ProfileStatusBanner user={user} />
      )}

      {/* Ülke Bilgisi Gerekli Modal */}
      <CountryRequiredModal
        isOpen={isCountryRequiredModalOpen}
        onClose={() => setIsCountryRequiredModalOpen(false)}
      />

      {/* Profesyonel Hesap Tip Seçimi Modal */}
      <ProfessionalAccountTypeSelection
        isOpen={isProfessionalAccountModalOpen}
        onClose={() => setIsProfessionalAccountModalOpen(false)}
        onSelectDoctor={handleSelectDoctor}
        onSelectCorporate={handleSelectCorporate}
      />

      {/* Doktor Başvuru Formu */}
      <DoctorApplicationForm
        isOpen={isDoctorFormOpen}
        onClose={() => setIsDoctorFormOpen(false)}
      />

      {/* Kurum Başvuru Formu */}
      <CorporateApplicationForm
        isOpen={isCorporateFormOpen}
        onClose={() => setIsCorporateFormOpen(false)}
      />
    </div>
  );
}
