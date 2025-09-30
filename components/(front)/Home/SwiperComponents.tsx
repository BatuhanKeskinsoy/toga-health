"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
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

  // Veri miktarını kontrol et
  const canAutoplay = data.length >= 3 && (type === 'specialties' || type === 'doctors'); // Sadece specialties ve doctors için autoplay


  // Her tür için grid satır sayısı
  const getGridRows = () => {
    switch (type) {
      case 'specialties':
      case 'doctors':
      case 'hospitals':
        return 3; // 3 satır
      case 'comments':
        return 2; // 2 satır
      case 'countries':
        return 1; // 1 satır
      default:
        return 1;
    }
  };

  // Her tür için sütun sayısı
  const getSlidesPerView = () => {
    switch (type) {
      case 'specialties':
        return 4; // 4 sütun
      case 'doctors':
      case 'hospitals':
        return 3; // 3 sütun
      case 'comments':
        return 2; // 2 sütun
      case 'countries':
        return 4; // 4 sütun
      default:
        return 1;
    }
  };

  const getSwiperConfig = () => {

    const baseConfig = {
      modules: [
        Navigation,
        Grid,
        ...(canAutoplay ? [Autoplay] : [])
      ],
      spaceBetween: 24,
      slidesPerView: getSlidesPerView(),
      slidesPerGroup: 1,
      speed: 600,
      effect: 'slide',
      allowTouchMove: false,
      // Grid ayarları
      grid: {
        rows: getGridRows(),
        fill: 'row' as const,
      },
      // Navigation ayarları
      navigation: {
        nextEl: `.${type}-swiper-next`,
        prevEl: `.${type}-swiper-prev`,
      },
      // Autoplay ayarları
      ...(canAutoplay && {
        autoplay: {
          delay: type === 'specialties' ? 4000 : 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: false,
          reverseDirection: false,
        }
      }),
      // Basit responsive ayarlar
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: type === 'comments' ? 1 : 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: type === 'comments' ? 2 : 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: getSlidesPerView(),
          spaceBetween: 24,
        },
      },
      className: `${type}-swiper homepage-swiper`,
      style: {
        '--swiper-navigation-size': '20px',
        '--swiper-pagination-bullet-size': '8px',
        '--swiper-pagination-bullet-horizontal-gap': '6px',
        '--swiper-wrapper-transition-timing-function': 'ease-in-out',
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
      '--swiper-wrapper-transition-timing-function': 'ease-in-out',
      '--swiper-wrapper-transition-duration': '800ms',
      '--swiper-wrapper-transition-property': 'transform'
    } as React.CSSProperties}>
      {/* Navigation Buttons - Swiper Navigation */}
      <button 
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
        onInit={(swiper) => {
          // Autoplay'i manuel olarak başlat
          if (canAutoplay && swiper.autoplay) {
            swiper.autoplay.start();
          }
        }}
      >
        {data.map((item, index) => {
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

    </div>
  );
}