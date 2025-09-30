"use client";
import React from "react";
import { HomeDoctor } from "@/lib/types/pages/homeTypes";
import DoctorCard from "./DoctorCard";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Dynamic import with SSR disabled for better SEO
const SwiperWrapper = dynamic(() => import("../SwiperComponents"), {
  ssr: false,
  loading: () => null,
});

interface DoctorsSectionProps {
  doctors: HomeDoctor[];
  locale: string;
}

export default function DoctorsSection({
  doctors,
  locale,
}: DoctorsSectionProps) {
  const t = useTranslations();
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-4 gap-4">
        <h2
          id="featured-doctors-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          {t("Öne Çıkan Doktorlar")}
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl">
          {t("Deneyimli ve uzman doktorlarımızdan randevu alın")}
        </p>
      </div>

      {/* Progressive Enhancement: SEO-friendly grid + Enhanced Swiper */}
      <div className="relative swiper-container">
        {/* SEO-friendly fallback grid - always visible for SEO */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 swiper-fallback"
          id="doctors-grid"
          data-swiper-fallback="true"
        >
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="group"
              itemScope
              itemType="https://schema.org/Person"
            >
              <DoctorCard doctor={doctor} locale={locale} />
            </article>
          ))}
        </div>

        {/* Enhanced Swiper - loads after hydration, hides fallback */}
        <SwiperWrapper type="doctors" data={doctors} locale={locale} />
      </div>
    </div>
  );
}
