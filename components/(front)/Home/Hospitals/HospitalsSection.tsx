"use client";
import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";
import HospitalCard from "./HospitalCard";

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
      <div className="flex max-lg:flex-col items-center justify-between mb-4 gap-4">
        <h2
          id="featured-doctors-heading"
          className="text-2xl md:text-3xl font-bold text-gray-900"
        >
          Öne Çıkan Hastaneler
        </h2>
        <p className="text-base md:text-lg text-gray-500">
          Modern sağlık tesislerimizden birini seçin
        </p>
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
            nextEl: ".hospitals-swiper-next",
            prevEl: ".hospitals-swiper-prev",
          }}
          pagination={{
            clickable: true,
            el: ".hospitals-swiper-pagination",
          }}
          autoplay={{
            delay: 5000,
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
          className="hospitals-swiper homepage-swiper"
        >
          {hospitals.map((hospital) => (
            <SwiperSlide key={hospital.id} className="lg:py-3 py-2 !my-0">
              <HospitalCard hospital={hospital} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="hospitals-swiper-prev max-lg:hidden absolute -left-12 top-1/2 -translate-y-15 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-emerald-600">
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
        <button className="hospitals-swiper-next max-lg:hidden absolute -right-12 top-1/2 -translate-y-15 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-emerald-600">
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
        <div className="hospitals-swiper-pagination flex justify-center mt-6"></div>
      </div>
    </div>
  );
}
