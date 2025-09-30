"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

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
  const swiperRef = useRef<SwiperType | null>(null);
  const [swiperId] = useState(() => `${type}-swiper`);

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };


  const getSwiperConfig = () => {
    // Veri miktarını kontrol et
    const hasEnoughData = data.length > 6; // Loop için minimum 6 veri gerekli
    const canLoop = hasEnoughData && type === 'countries'; // Sadece countries için loop
    
    const baseConfig = {
      modules: [Pagination, ...(canLoop ? [Autoplay] : []), Grid],
      spaceBetween: 20,
      slidesPerView: 1,
      slidesPerGroup: 1,
      speed: 800, // Daha yavaş geçiş
      effect: 'slide',
      allowTouchMove: true,
      resistanceRatio: 0.85,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      // Loop ve autoplay ayarları
      loop: canLoop,
      ...(canLoop && {
        autoplay: {
          delay: type === 'countries' ? 3000 : 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
      }),
      ...(type !== 'countries' && {
        grid: {
          rows: type === 'comments' ? 2 : 3,
          fill: "row" as const
        }
      }),
      pagination: {
        clickable: true,
        el: `#${swiperId}-pagination`,
        type: 'bullets' as const,
        dynamicBullets: false,
        dynamicMainBullets: 1,
      },
        breakpoints: {
        640: {
          slidesPerView: type === 'countries' || type === 'comments' ? 1 : 1,
          slidesPerGroup: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: type === 'countries' || type === 'comments' ? 2 : 2,
          slidesPerGroup: 1,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: type === 'countries' || type === 'comments' ? 3 : 3,
          slidesPerGroup: 1,
          spaceBetween: 24,
        },
        1280: {
          slidesPerView: type === 'countries' || type === 'comments' ? 3 : 4,
          slidesPerGroup: 1,
          spaceBetween: 24,
        },
      },
      className: `${type}-swiper homepage-swiper`,
      style: {
        '--swiper-navigation-size': '20px',
        '--swiper-pagination-bullet-size': '8px',
        '--swiper-pagination-bullet-horizontal-gap': '6px',
        '--swiper-wrapper-transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '--swiper-wrapper-transition-duration': '800ms',
        '--swiper-wrapper-transition-property': 'transform',
      } as React.CSSProperties,
    };

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
    <div className="relative px-16" style={{ 
      '--swiper-wrapper-transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      '--swiper-wrapper-transition-duration': '800ms',
      '--swiper-wrapper-transition-property': 'transform'
    } as React.CSSProperties}>
      {/* Navigation Buttons - Manuel event handling */}
      <button 
        onClick={handlePrevClick}
        className={`${type}-swiper-prev max-lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 ${getNavigationButtonClass()}`}
      >
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
      <button 
        onClick={handleNextClick}
        className={`${type}-swiper-next max-lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 ${getNavigationButtonClass()}`}
      >
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

      <Swiper 
        {...getSwiperConfig()}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
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

      {/* Pagination */}
      <div id={`${swiperId}-pagination`} className={`${type}-swiper-pagination flex justify-center mt-6`}></div>
    </div>
  );
}