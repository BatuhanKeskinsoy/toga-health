import React from "react";
import { HomeDoctor } from "@/lib/types/pages/homeTypes";
import SwiperWrapper from "../SwiperComponents";
import { getTranslations } from "next-intl/server";

interface DoctorsSectionProps {
  doctors: HomeDoctor[];
  locale: string;
}

export default async function DoctorsSection({
  doctors,
  locale,
}: DoctorsSectionProps) {
  const t = await getTranslations({ locale });
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-4 gap-4">
        <h2
          id="featured-doctors-heading"
          className="text-2xl lg:text-3xl font-bold text-gray-900"
        >
          {t("Öne Çıkan Doktorlar")}
        </h2>
        <p className="text-base lg:text-lg text-gray-600 max-w-2xl">
          {t("Deneyimli ve uzman doktorlarımızdan randevu alın")}
        </p>
      </div>

      <SwiperWrapper type="doctors" data={doctors} locale={locale} />
    </div>
  );
}
