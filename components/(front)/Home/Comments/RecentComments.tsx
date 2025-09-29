"use client";
import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";
import CommentCard from "./CommentCard";

interface RecentCommentsProps {
  comments: HomeComment[];
}

export default function RecentComments({ comments }: RecentCommentsProps) {
  return (
      <div className="container p-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="recent-comments-heading"
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
            >
              Hasta Yorumları
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              Hastalarımızın deneyimlerini okuyun
            </p>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, Grid]}
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            grid={{
              rows: 2,
              fill: "row",
            }}
            navigation={{
              nextEl: ".comments-swiper-next",
              prevEl: ".comments-swiper-prev",
            }}
            pagination={{
              clickable: true,
              el: ".comments-swiper-pagination",
            }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 20,
                grid: {
                  rows: 2,
                  fill: "row",
                },
              },
              768: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 24,
                grid: {
                  rows: 2,
                  fill: "row",
                },
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 24,
                grid: {
                  rows: 2,
                  fill: "row",
                },
              },
            }}
            className="comments-swiper homepage-swiper"
          >
            {comments.slice(0, 12).map((comment) => (
              <SwiperSlide key={comment.id} className="lg:py-3 py-2 !my-0">
                <CommentCard comment={comment} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="comments-swiper-prev max-lg:hidden absolute -left-12 top-1/2 -translate-y-10 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-yellow-600">
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
          <button className="comments-swiper-next max-lg:hidden absolute -right-12 top-1/2 -translate-y-10 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-yellow-600">
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
          <div className="comments-swiper-pagination flex justify-center mt-6"></div>
        </div>
      </div>
  );
}
