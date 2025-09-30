"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  const hasEnoughData = data.length >= 3; // Loop için minimum 3 veri gerekli
  const canAutoplay = hasEnoughData && (type === 'specialties' || type === 'doctors'); // Sadece specialties ve doctors için autoplay
  
  // Grid ayarları - CSS Grid ile kendi grid sistemimiz
  const getGridRows = () => {
    switch (type) {
      case 'specialties':
      case 'doctors':
      case 'hospitals':
        return 3;
      case 'comments':
        return 2;
      case 'countries':
        return 1; // Tek satır
      default:
        return 1;
    }
  };
  
  const gridRows = getGridRows();
  const useGrid = gridRows > 1;
  
  // Loop ayarları - tüm swiper'larda aktif
  const canLoop = hasEnoughData && type !== 'comments'; // Comments hariç tüm swiper'larda loop

  // Navigation artık Swiper'ın kendi sistemi ile çalışıyor


  const getSwiperConfig = () => {
    // Debug için
    console.log(`${type} swiper:`, {
      dataLength: data.length,
      hasEnoughData,
      canLoop,
      canAutoplay,
      useGrid,
      gridRows,
      totalSlides: useGrid ? Math.ceil(data.length / gridRows) : data.length
    });
    
    const baseConfig = {
      modules: [
        Navigation,
        Pagination, 
        ...(canAutoplay ? [Autoplay] : [])
      ],
      spaceBetween: 20,
      slidesPerView: 1,
      slidesPerGroup: 1,
      speed: 800,
      effect: 'slide',
      allowTouchMove: true,
      resistanceRatio: 0.85,
      // Loop ayarları - tüm swiper'larda aktif
      loop: canLoop,
      loopFillGroupWithBlank: true,
      loopAdditionalSlides: 1,
      // Navigation ayarları
      navigation: {
        nextEl: `.${type}-swiper-next`,
        prevEl: `.${type}-swiper-prev`,
      },
      // Autoplay ayarları
      ...(canAutoplay && {
        autoplay: {
          delay: type === 'specialties' ? 4000 : 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: false,
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
        1280: {
          slidesPerView: 4,
          slidesPerGroup: 1,
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
        onSlideChange={(swiper) => {
          // Loop sonunda autoplay'i yeniden başlat
          if (canAutoplay && swiper.autoplay && swiper.isEnd) {
            setTimeout(() => {
              swiper.autoplay.start();
            }, 100);
          }
        }}
      >
        {useGrid ? (
          // Grid için veriyi gruplara böl
          Array.from({ length: Math.ceil(data.length / gridRows) }, (_, groupIndex) => {
            const groupData = data.slice(groupIndex * gridRows, (groupIndex + 1) * gridRows);
            return (
              <SwiperSlide key={`group-${groupIndex}`} className="lg:py-3 py-2 !my-0">
                <div 
                  className="grid gap-4 w-full"
                  style={{
                    gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                    gridTemplateColumns: '1fr',
                    height: 'auto'
                  }}
                >
                  {groupData.map((item, itemIndex) => (
                    <div 
                      key={item.id || `${type}-${groupIndex}-${itemIndex}`}
                      className="w-full"
                    >
                      {renderCard(item, groupIndex * gridRows + itemIndex)}
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            );
          })
        ) : (
          // Normal carousel için
          data.map((item, index) => {
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
          })
        )}
      </Swiper>

      {/* Pagination */}
      <div id={`${swiperId}-pagination`} className={`${type}-swiper-pagination flex justify-center mt-6`}></div>
    </div>
  );
}