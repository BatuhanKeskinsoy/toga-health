"use client";
import React from "react";
import { PopularCountry } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import CountryCard from "./CountryCard";

interface PopularCountriesProps {
  countries: PopularCountry[];
}

export default function PopularCountries({ countries }: PopularCountriesProps) {
  return (
      <div className="container p-4 mx-auto">
        <div className="text-center mb-4">
          <h2
            id="popular-countries-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Popüler Ülkeler
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Dünya çapında sağlık hizmetlerimiz
          </p>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            navigation={{
              nextEl: ".countries-swiper-next",
              prevEl: ".countries-swiper-prev",
            }}
            pagination={{
              clickable: true,
              el: ".countries-swiper-pagination",
            }}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 24,
              },
            }}
            className="countries-swiper homepage-swiper"
          >
            {countries.map((country, index) => (
              <SwiperSlide key={index} className="lg:py-6 py-4">
                <CountryCard country={country} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="countries-swiper-prev max-lg:hidden absolute -left-12 top-1/2 -translate-y-4 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-indigo-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="countries-swiper-next max-lg:hidden absolute -right-12 top-1/2 -translate-y-4 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-indigo-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Pagination */}
          <div className="countries-swiper-pagination flex justify-center mt-6"></div>
        </div>
      </div>
  );
}
