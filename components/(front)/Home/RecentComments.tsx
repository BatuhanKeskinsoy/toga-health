"use client";
import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import { IoStar, IoCheckmarkCircle, IoChatbubbleEllipses } from "react-icons/io5";

interface RecentCommentsProps {
  comments: HomeComment[];
}

export default function RecentComments({ comments }: RecentCommentsProps) {
  return (
    <section className="mb-16" aria-labelledby="recent-comments-heading">
      <div className="text-center mb-12">
        <h2 id="recent-comments-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Hasta Yorumları
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Hastalarımızın deneyimlerini okuyun
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {comments.slice(0, 6).map((comment) => (
          <article
            key={comment.id}
            className="group relative"
            itemScope
            itemType="https://schema.org/Review"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-2">
              {/* Quote Icon */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <IoChatbubbleEllipses className="text-lg md:text-2xl text-white" />
                </div>
              </div>

              {/* Rating ve Tarih */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400" itemProp="reviewRating">
                    {[...Array(5)].map((_, i) => (
                      <IoStar
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          i < comment.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-700">
                    {comment.rating}/5
                  </span>
                </div>
                <div className="text-xs md:text-sm text-gray-500 bg-gray-50 rounded-full px-2 md:px-3 py-1">
                  {new Date(comment.comment_date).toLocaleDateString('tr-TR')}
                </div>
              </div>

              {/* Yorum Metni */}
              <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 line-clamp-4 leading-relaxed text-center italic" itemProp="reviewBody">
                "{comment.comment}"
              </p>

              {/* Yazar Bilgisi */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-sm md:text-lg font-bold text-white">
                      {comment.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-1 md:gap-2" itemProp="author">
                      {comment.author}
                      {comment.is_verified && (
                        <IoCheckmarkCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {comment.is_verified ? "Doğrulanmış Hasta" : "Hasta"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
