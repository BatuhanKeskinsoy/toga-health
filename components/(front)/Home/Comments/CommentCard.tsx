"use client";
import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import { IoStar, IoCheckmarkCircle, IoChatbubbleEllipses } from "react-icons/io5";

interface CommentCardProps {
  comment: HomeComment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <article
      className="group relative h-full"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:-translate-y-1 h-full flex flex-col">
        {/* Header - Quote Icon ve Rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <IoChatbubbleEllipses className="text-xl text-white" />
          </div>
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400" itemProp="reviewRating">
              {[...Array(5)].map((_, i) => (
                <IoStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < comment.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700 ml-1">
              {comment.rating}/5
            </span>
          </div>
        </div>

        {/* Yorum Metni */}
        <div className="flex-1 mb-6">
          <p className="text-base text-gray-700 line-clamp-4 leading-relaxed italic" itemProp="reviewBody">
            "{comment.comment}"
          </p>
        </div>

        {/* Footer - Yazar Bilgisi ve Tarih */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-base font-bold text-white">
                {comment.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-base font-bold text-gray-900 flex items-center gap-2" itemProp="author">
                {comment.author}
                {comment.is_verified && (
                  <IoCheckmarkCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="text-sm text-gray-500">
                {comment.is_verified ? "Doğrulanmış Hasta" : "Hasta"}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 rounded-full px-3 py-1.5 font-medium">
            {new Date(comment.comment_date).toLocaleDateString('tr-TR')}
          </div>
        </div>
      </div>
    </article>
  );
}
