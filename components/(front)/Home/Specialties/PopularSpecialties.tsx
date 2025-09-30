"use client";
import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import SpecialtyCard from "./SpecialtyCard";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Dynamic import with SSR disabled for better SEO
const SwiperWrapper = dynamic(() => import("../SwiperComponents"), {
  ssr: false,
  loading: () => null, // No loading state to avoid layout shift
});

interface PopularSpecialtiesProps {
  specialties: PopularSpecialty[];
  locale: string;
}

export default function PopularSpecialties({
  specialties,
  locale,
}: PopularSpecialtiesProps) {
  const t = useTranslations();
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-8 gap-4">
        <div className="flex flex-col max-lg:text-center text-left gap-3">
          <h2
            id="popular-specialties-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900"
          >
            {t("Popüler Branşlar")}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            {t("En çok tercih edilen uzmanlık alanlarından birini seçin")}
          </p>
        </div>
        <Link
          href={getLocalizedUrl("/branches", locale)}
          className="flex items-center gap-2 bg-gradient-to-r from-sitePrimary to-sitePrimary/70 text-white max-lg:w-full justify-center px-6 md:px-8 py-3 md:py-4 rounded-md font-semibold hover:from-sitePrimary hover:to-sitePrimary transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-sm md:text-base">{t("Tüm Branşları Gör")}</span>
        </Link>
      </div>

      {/* Progressive Enhancement: SEO-friendly grid + Enhanced Swiper */}
      <div className="relative swiper-container">
        {/* SEO-friendly fallback grid - always visible for SEO */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 swiper-fallback"
          id="specialties-grid"
          data-swiper-fallback="true"
        >
          {specialties.map((specialty) => (
            <article
              key={specialty.id}
              className="group"
              itemScope
              itemType="https://schema.org/MedicalSpecialty"
            >
              <SpecialtyCard specialty={specialty} locale={locale} />
            </article>
          ))}
        </div>

        {/* Enhanced Swiper - loads after hydration, hides fallback */}
        <SwiperWrapper type="specialties" data={specialties} locale={locale} />
      </div>
    </div>
  );
}
