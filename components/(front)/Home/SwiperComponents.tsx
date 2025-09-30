"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

// Import card components
import SpecialtyCard from "./Specialties/SpecialtyCard";
import DoctorCard from "./Doctors/DoctorCard";
import HospitalCard from "./Hospitals/HospitalCard";
import CommentCard from "./Comments/CommentCard";
import CountryCard from "./Countries/CountryCard";

// Generic Swiper Wrapper Component
interface SwiperWrapperProps {
  type: 'specialties' | 'doctors' | 'hospitals' | 'comments' | 'countries';
  data: any[];
  locale: string;
}

export default function SwiperWrapper({ type, data, locale }: SwiperWrapperProps) {

  const getSwiperConfig = () => {
    const baseConfig = {
      modules: [Navigation, Pagination, Autoplay, Grid],
      spaceBetween: 20,
      slidesPerView: 1,
      slidesPerGroup: 1,
      navigation: {
        nextEl: `.${type}-swiper-next`,
        prevEl: `.${type}-swiper-prev`,
      },
      pagination: {
        clickable: true,
        el: `.${type}-swiper-pagination`,
      },
      autoplay: {
        delay: type === 'hospitals' ? 5000 : type === 'comments' ? 6000 : type === 'countries' ? 7000 : 4000,
        disableOnInteraction: false,
      },
      loop: true,
      breakpoints: {
        640: {
          slidesPerView: type === 'countries' || type === 'comments' ? 1 : 1,
          slidesPerGroup: 1,
          spaceBetween: 20,
          ...(type !== 'countries' && {
            grid: { 
              rows: type === 'comments' ? 2 : 3, 
              fill: "row" as const 
            }
          }),
        },
        768: {
          slidesPerView: type === 'countries' || type === 'comments' ? 2 : 2,
          slidesPerGroup: 1,
          spaceBetween: 24,
          ...(type !== 'countries' && {
            grid: { 
              rows: type === 'comments' ? 2 : 3, 
              fill: "row" as const 
            }
          }),
        },
        1024: {
          slidesPerView: type === 'countries' || type === 'comments' ? 3 : 3,
          slidesPerGroup: 1,
          spaceBetween: 24,
          ...(type !== 'countries' && {
            grid: { 
              rows: type === 'comments' ? 2 : 3, 
              fill: "row" as const 
            }
          }),
        },
        1280: {
          slidesPerView: type === 'countries' || type === 'comments' ? 3 : 4,
          slidesPerGroup: 1,
          spaceBetween: 24,
          ...(type !== 'countries' && {
            grid: { 
              rows: type === 'comments' ? 2 : 3, 
              fill: "row" as const 
            }
          }),
        },
      },
      className: `${type}-swiper homepage-swiper`,
    };

    // Add grid config for non-country swipers
    if (type !== 'countries') {
      (baseConfig as any).grid = { 
        rows: type === 'comments' ? 2 : 3, 
        fill: "row" as const
      };
    }

    return baseConfig;
  };

  const renderCard = (item: any, index: number) => {
    switch (type) {
      case 'specialties':
        return <SpecialtyCard specialty={item} locale={locale} />;
      case 'doctors':
        return <DoctorCard doctor={item} locale={locale} />;
      case 'hospitals':
        return <HospitalCard hospital={item} locale={locale} />;
      case 'comments':
        return <CommentCard comment={item} locale={locale} />;
      case 'countries':
        return <CountryCard country={item} />;
      default:
        return null;
    }
  };

  const getNavigationButtonClass = () => {
    const colorMap = {
      specialties: 'hover:bg-blue-500 hover:text-white',
      doctors: 'hover:bg-sitePrimary hover:text-white',
      hospitals: 'hover:bg-sitePrimary hover:text-white',
      comments: 'hover:bg-orange-500 hover:text-white',
      countries: 'hover:bg-violet-500 hover:text-white',
    };
    return colorMap[type] || 'hover:text-gray-600';
  };

  return (
    <div className="relative">
      <Swiper {...getSwiperConfig()}>
        {data.map((item, index) => {
          // Generate unique key based on item type
          const getKey = () => {
            if (item.id) return item.id;
            if (type === 'countries') return `country-${index}`;
            return `${type}-${index}`;
          };
          
          return (
            <SwiperSlide key={getKey()} className="lg:py-3 py-2 !my-0">
              {renderCard(item, index)}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Buttons */}
      <button className={`${type}-swiper-prev max-lg:hidden absolute -left-12 top-1/2 -translate-y-15 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 ${getNavigationButtonClass()}`}>
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
      <button className={`${type}-swiper-next max-lg:hidden absolute -right-12 top-1/2 -translate-y-15 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 ${getNavigationButtonClass()}`}>
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
      <div className={`${type}-swiper-pagination flex justify-center mt-6`}></div>
    </div>
  );
}
