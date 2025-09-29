"use client";
import React from "react";
import { PopularCountry } from "@/lib/types/pages/homeTypes";
import CountryCard from "./CountryCard";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled for better SEO
const  SwiperWrapper = dynamic(() => import("../SwiperComponents"), { 
  ssr: false,
  loading: () => null
});

interface PopularCountriesProps {
  countries: PopularCountry[];
}

export default function PopularCountries({ countries }: PopularCountriesProps) {
  return (
    <div className="container p-4 mx-auto">
      <div className="text-center mb-8">
        <h2
          id="popular-countries-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          Popüler Ülkeler
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Dünya çapında sağlık hizmetlerimiz
        </p>
      </div>

      {/* Progressive Enhancement: SEO-friendly grid + Enhanced Swiper */}
      <div className="relative swiper-container">
        {/* SEO-friendly fallback grid - always visible for SEO */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 swiper-fallback" 
          id="countries-grid"
          data-swiper-fallback="true"
        >
          {countries.map((country, index) => (
            <article 
              key={index} 
              className="group" 
              itemScope 
              itemType="https://schema.org/Country"
            >
              <CountryCard country={country} />
            </article>
          ))}
        </div>

        {/* Enhanced Swiper - loads after hydration, hides fallback */}
        <SwiperWrapper type="countries" data={countries} locale="" />
      </div>
    </div>
  );
}
