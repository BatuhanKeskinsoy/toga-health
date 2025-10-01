import React from "react";
import { PopularCountry } from "@/lib/types/pages/homeTypes";
import SwiperWrapper from "../SwiperComponents";
import { getTranslations } from "next-intl/server";

interface PopularCountriesProps {
  countries: PopularCountry[];
  locale: string;
}

export default async function PopularCountries({ countries, locale }: PopularCountriesProps) {
  const t = await getTranslations({ locale });
  return (
    <div className="container p-4 mx-auto">
      <div className="text-center mb-8">
        <h2
          id="popular-countries-heading"
          className="text-2xl lg:text-3xl font-bold text-gray-900"
        >
          {t("Popüler Ülkeler")}
        </h2>
        <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          {t("Dünya çapında sağlık hizmetlerimiz")}
        </p>
      </div>

      <SwiperWrapper type="countries" data={countries} locale="" />
    </div>
  );
}
