"use client";
import React from "react";
import { PopularSpecialty } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SpecialtyCard from "./SpecialtyCard";
import CustomButton from "@/components/others/CustomButton";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface PopularSpecialtiesProps {
  specialties: PopularSpecialty[];
  locale: string;
}

export default function PopularSpecialties({ specialties, locale }: PopularSpecialtiesProps) {
  return (
    <section className="mb-16" aria-labelledby="popular-specialties-heading">
      <div className="text-center mb-8">
        <h2 id="popular-specialties-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Popüler Branşlar
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          En çok tercih edilen uzmanlık alanlarından birini seçin
        </p>
      </div>
      
      <div className="relative px-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          slidesPerGroup={2}
          navigation={{
            nextEl: '.specialties-swiper-next',
            prevEl: '.specialties-swiper-prev',
          }}
          pagination={{
            clickable: true,
            el: '.specialties-swiper-pagination',
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 8,
              slidesPerGroup: 8,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 10,
              slidesPerGroup: 10,
              spaceBetween: 24,
            },
          }}
          className="specialties-swiper homepage-swiper"
        >
          {specialties.slice(0, 12).map((specialty) => (
            <SwiperSlide key={specialty.id} className="lg:py-6 py-4">
              <SpecialtyCard specialty={specialty} locale={locale} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="specialties-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="specialties-swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination */}
        <div className="specialties-swiper-pagination flex justify-center mt-6"></div>
      </div>
      
      <div className="text-center mt-8">
        <CustomButton
          handleClick={() => window.location.href = getLocalizedUrl("/uzmanlik-alanlari", locale)}
          title="Tüm Branşları Gör"
          containerStyles="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          textStyles="text-sm md:text-base"
        />
      </div>
    </section>
  );
}
