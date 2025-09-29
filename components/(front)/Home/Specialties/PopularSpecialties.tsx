"use client";
import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";
import SpecialtyCard from "./SpecialtyCard";
import Link from "next/link";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface PopularSpecialtiesProps {
  specialties: PopularSpecialty[];
  locale: string;
}

export default function PopularSpecialties({
  specialties,
  locale,
}: PopularSpecialtiesProps) {
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-8 gap-4">
        <div className="flex flex-col max-lg:text-center text-left">
          <h2
            id="popular-specialties-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Popüler Branşlar
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            En çok tercih edilen uzmanlık alanlarından birini seçin
          </p>
        </div>
        <Link
          href={getLocalizedUrl("/uzmanlik-alanlari", locale)}
          className="flex items-center gap-2 bg-gradient-to-r from-sitePrimary to-sitePrimary/70 text-white max-lg:w-full justify-center px-6 md:px-8 py-3 md:py-4 rounded-md font-semibold hover:from-sitePrimary hover:to-sitePrimary transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-sm md:text-base">Tüm Branşları Gör</span>
        </Link>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Grid]}
          spaceBetween={20}
          slidesPerView={1}
          slidesPerGroup={1}
          grid={{
            rows: 3,
            fill: "row",
          }}
          navigation={{
            nextEl: ".specialties-swiper-next",
            prevEl: ".specialties-swiper-prev",
          }}
          pagination={{
            clickable: true,
            el: ".specialties-swiper-pagination",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 20,
              grid: {
                rows: 3,
                fill: "row",
              },
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 24,
              grid: {
                rows: 3,
                fill: "row",
              },
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 24,
              grid: {
                rows: 3,
                fill: "row",
              },
            },
            1280: {
              slidesPerView: 4,
              slidesPerGroup: 1,
              spaceBetween: 24,
              grid: {
                rows: 3,
                fill: "row",
              },
            },
          }}
          className="specialties-swiper homepage-swiper"
        >
          {specialties.map((specialty) => (
            <SwiperSlide key={specialty.id} className="lg:py-3 py-2 !my-0">
              <SpecialtyCard specialty={specialty} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="specialties-swiper-prev max-lg:hidden absolute -left-12 top-1/2 -translate-y-15 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-sitePrimary">
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
        <button className="specialties-swiper-next max-lg:hidden absolute -right-12 top-1/2 -translate-y-15 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-sitePrimary">
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
        <div className="specialties-swiper-pagination flex justify-center mt-6"></div>
      </div>
    </div>
  );
}
