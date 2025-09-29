"use client";
import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import HospitalCard from "./HospitalCard";
import Link from "next/link";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled for better SEO
const SwiperWrapper = dynamic(() => import("../SwiperComponents"), { 
  ssr: false,
  loading: () => null
});

interface HospitalsSectionProps {
  hospitals: HomeHospital[];
  locale: string;
}

export default function HospitalsSection({
  hospitals,
  locale,
}: HospitalsSectionProps) {
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-8 gap-4">
        <div className="flex flex-col max-lg:text-center text-left">
          <h2
            id="featured-hospitals-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Öne Çıkan Hastaneler
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Modern sağlık tesislerimizden birini seçin
          </p>
        </div>
        <Link
          href={`/${locale}${getLocalizedUrl("/hospitals", locale)}`}
          className="flex items-center gap-2 bg-gradient-to-r from-sitePrimary to-sitePrimary/70 text-white max-lg:w-full justify-center px-6 md:px-8 py-3 md:py-4 rounded-md font-semibold hover:from-sitePrimary hover:to-sitePrimary transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-sm md:text-base">Tüm Hastaneleri Gör</span>
        </Link>
      </div>

      {/* Progressive Enhancement: SEO-friendly grid + Enhanced Swiper */}
      <div className="relative swiper-container">
        {/* SEO-friendly fallback grid - always visible for SEO */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 swiper-fallback" 
          id="hospitals-grid"
          data-swiper-fallback="true"
        >
          {hospitals.map((hospital) => (
            <article 
              key={hospital.id} 
              className="group" 
              itemScope 
              itemType="https://schema.org/Hospital"
            >
              <HospitalCard hospital={hospital} locale={locale} />
            </article>
          ))}
        </div>

        {/* Enhanced Swiper - loads after hydration, hides fallback */}
        <SwiperWrapper type="hospitals" data={hospitals} locale={locale} />
      </div>
    </div>
  );
}
