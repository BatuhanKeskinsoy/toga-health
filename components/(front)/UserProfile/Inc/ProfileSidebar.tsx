"use client";
import { navLinksAuthCorporate, navLinksAuthDoctor, navLinksAuthIndividual } from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo } from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import { showProfessionalAccountTypeSelection } from "@/lib/functions/professionalAccountAlert";

type Props = {
  user: UserTypes | null;
};

export default function ProfileSidebar({ user }: Props) {
  const path = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const isActive = (localizedUrl: string) =>
    path === localizedUrl || path.startsWith(localizedUrl + "/");

  const links = useMemo(() => {
    const type = user?.user_type || "individual";
    if (type === "doctor") return navLinksAuthDoctor;
    if (type === "corporate") return navLinksAuthCorporate;
    return navLinksAuthIndividual;
  }, [user?.user_type]);

  return (
    <div className="flex flex-col gap-2">
      {/* Profesyonel Tip Seçim Butonu - Sadece individual kullanıcılar için */}
      {user?.user_type === "individual" && (
        <button
          onClick={showProfessionalAccountTypeSelection}
          className="w-full z-10 inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700 shadow-md transition-all duration-300"
        >
          Profesyonel Misiniz?
        </button>
      )}

      <nav className="flex flex-col bg-gray-50 xl:border xl:border-gray-200 xl:rounded-md xl:overflow-hidden overflow-y-auto max-xl:h-[calc(100dvh-124px)]">
        {links.map((link) => {
          const localized = getLocalizedUrl(link.url, locale);
          const active = isActive(localized);
          return (
            <Link
              key={link.url}
              href={localized}
              title={t(link.title)}
              className={`flex items-center gap-3 px-4 py-2.5 font-medium text-[16px] transition-all duration-200 ${
                active ? "bg-red-600 text-white" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {t(link.title)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
