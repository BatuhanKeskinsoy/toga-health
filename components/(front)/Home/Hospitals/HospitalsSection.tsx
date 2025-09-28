"use client";
import React from "react";
import { HomeHospital } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import HospitalCard from "./HospitalCard";
import Link from "next/link";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface HospitalsSectionProps {
  hospitals: HomeHospital[];
  locale: string;
}

export default function HospitalsSection({ hospitals, locale }: HospitalsSectionProps) {
  return (
    <section className="mb-16" aria-labelledby="featured-hospitals-heading">
      <div className="text-center mb-8">
        <h2 id="featured-hospitals-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Öne Çıkan Hastaneler
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Modern sağlık tesislerimizden birini seçin
        </p>
      </div>
      
      <div className="relative px-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: '.hospitals-swiper-next',
            prevEl: '.hospitals-swiper-prev',
          }}
          pagination={{
            clickable: true,
            el: '.hospitals-swiper-pagination',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="hospitals-swiper homepage-swiper"
        >
          {hospitals.slice(0, 6).map((hospital) => (
            <SwiperSlide key={hospital.id} className="lg:py-6 py-4">
              <HospitalCard hospital={hospital} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="hospitals-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="hospitals-swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination */}
        <div className="hospitals-swiper-pagination flex justify-center mt-6"></div>
      </div>
      
      <div className="text-center mt-8">
        <Link
          href={getLocalizedUrl("/hastaneler", locale)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <span className="text-sm md:text-base">Tüm Hastaneleri Gör</span>
        </Link>
      </div>
    </section>
  );
}
