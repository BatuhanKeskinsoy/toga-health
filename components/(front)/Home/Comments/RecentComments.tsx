"use client";
import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import CommentCard from "./CommentCard";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled for better SEO
const SwiperWrapper = dynamic(() => import("../SwiperComponents"), { 
  ssr: false,
  loading: () => null
});

interface RecentCommentsProps {
  comments: HomeComment[];
  locale: string;
}

export default function RecentComments({ comments, locale }: RecentCommentsProps) {
  return (
    <div className="container p-4 mx-auto">
      <div className="flex max-lg:flex-col items-center justify-between mb-8 gap-4">
        <div className="flex flex-col max-lg:text-center text-left">
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

      {/* Progressive Enhancement: SEO-friendly grid + Enhanced Swiper */}
      <div className="relative swiper-container">
        {/* SEO-friendly fallback grid - always visible for SEO */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 swiper-fallback" 
          id="comments-grid"
          data-swiper-fallback="true"
        >
          {comments.map((comment) => (
            <article 
              key={comment.id} 
              className="group" 
              itemScope 
              itemType="https://schema.org/Review"
            >
              <CommentCard comment={comment} locale={locale} />
            </article>
          ))}
        </div>

        {/* Enhanced Swiper - loads after hydration, hides fallback */}
        <SwiperWrapper type="comments" data={comments} locale={locale} />
      </div>
    </div>
  );
}
