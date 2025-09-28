"use client";
import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import CommentCard from "./CommentCard";

interface RecentCommentsProps {
  comments: HomeComment[];
}

export default function RecentComments({ comments }: RecentCommentsProps) {
  return (
    <section className="mb-16" aria-labelledby="recent-comments-heading">
      <div className="text-center mb-8">
        <h2 id="recent-comments-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Hasta Yorumları
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Hastalarımızın deneyimlerini okuyun
        </p>
      </div>
      
      <div className="relative px-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: '.comments-swiper-next',
            prevEl: '.comments-swiper-prev',
          }}
          pagination={{
            clickable: true,
            el: '.comments-swiper-pagination',
          }}
          autoplay={{
            delay: 6000,
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
          className="comments-swiper homepage-swiper"
        >
          {comments.slice(0, 6).map((comment) => (
            <SwiperSlide key={comment.id} className="lg:py-6 py-4">
              <CommentCard comment={comment} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button className="comments-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-yellow-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="comments-swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-yellow-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination */}
        <div className="comments-swiper-pagination flex justify-center mt-6"></div>
      </div>
    </section>
  );
}
