import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import SwiperWrapper from "../SwiperComponents";
import { getTranslations } from "next-intl/server";

interface PopularSpecialtiesProps {
  specialties: PopularSpecialty[];
  locale: string;
}

export default async function PopularSpecialties({
  specialties,
  locale,
}: PopularSpecialtiesProps) {
  const t = await getTranslations({ locale });
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-8 gap-4">
        <div className="flex flex-col max-lg:text-center text-left gap-3">
          <h2
            id="popular-specialties-heading"
            className="text-2xl lg:text-3xl font-bold text-gray-900"
          >
            {t("Popüler Branşlar")}
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl">
            {t("En çok tercih edilen uzmanlık alanlarından birini seçin")}
          </p>
        </div>
        <Link
          href={getLocalizedUrl("/branches", locale)}
          className="flex items-center gap-2 bg-gradient-to-r from-sitePrimary to-sitePrimary/70 text-white max-lg:w-full justify-center px-6 lg:px-8 py-3 lg:py-4 rounded-md font-semibold hover:from-sitePrimary hover:to-sitePrimary transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-sm lg:text-base">{t("Tüm Branşları Gör")}</span>
        </Link>
      </div>

      <SwiperWrapper type="specialties" data={specialties} locale={locale} />
    </div>
  );
}
