import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import SwiperWrapper from "../SwiperComponents";
import { getTranslations } from "next-intl/server";

interface HospitalsSectionProps {
  hospitals: HomeHospital[];
  locale: string;
}

export default async function HospitalsSection({
  hospitals,
  locale,
}: HospitalsSectionProps) {
  const t = await getTranslations({ locale });
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-4 gap-4">
        <h2
          id="featured-hospitals-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          {t("Öne Çıkan Hastaneler")}
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl">
          {t("Modern sağlık tesislerimizden birini seçin")}
        </p>
      </div>

      <SwiperWrapper type="hospitals" data={hospitals} locale={locale} />
    </div>
  );
}
