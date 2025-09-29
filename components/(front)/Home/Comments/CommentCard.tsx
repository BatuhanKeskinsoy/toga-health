import React from "react";
import { HomeComment } from "@/lib/types/pages/homeTypes";
import { IoStar } from "react-icons/io5";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getStar } from "@/lib/functions/getStar";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Link from "next/link";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface CommentCardProps {
  comment: HomeComment;
  locale: string;
}

export default function CommentCard({ comment, locale }: CommentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article
      className="group relative h-full"
      itemScope
      itemType="https://schema.org/Review"
    >
      {/* Main Card */}
      <Link href={`/${locale}${getLocalizedUrl("/[...slug]", locale, {
        slug: [
          comment.answer.slug,
          comment.answer.doctor.specialty.slug,
          comment.answer.country_slug,
          comment.answer.city_slug,
        ].join("/"),
      })}`}

      aria-label={`${comment.answer.name} doktorunu görüntüle`} className="relative bg-gray-50 rounded-md p-6 pb-4 shadow-md hover:shadow-xl shadow-gray-100 transition-all duration-300 border border-gray-200 group-hover:-translate-y-1 h-full flex flex-col gap-3">
        {/* Header - Quote Icon and Rating */}
        <div className="flex items-start justify-between gap-3">
          {/* Answer Avatar */}
          <div className="relative w-16 h-16 min-w-16 rounded-md overflow-hidden shadow-md">
            {comment.answer.photo && (
              <ProfilePhoto
                photo={comment.answer.photo}
                name={comment.answer.name}
                size={64}
                fontSize={24}
                responsiveSizes={{
                  desktop: 64,
                  mobile: 40,
                }}
                responsiveFontSizes={{
                  desktop: 24,
                  mobile: 12,
                }}
              />
            )}
          </div>

          {/* Answer Info */}
          <div className="flex flex-col gap-1 w-full">
            <h5
              className="text-lg font-bold text-gray-900 line-clamp-1"
              title={comment.answer.name}
            >
              {comment.answer.name}
            </h5>
            <span className="flex items-center gap-2 text-sm text-gray-500">
              {comment.answer.doctor.specialty.name}
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-max">
            <div className="flex text-yellow-400" itemProp="reviewRating">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{getStar(i + 1, comment.answer.rating, 16)}</span>
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-1">
              {comment.answer.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <hr className="border-orange-100" />
        {/* Comment Text */}
        <div className="flex flex-col h-full justify-between gap-4">
          <blockquote
            itemProp="reviewBody"
            title={comment.comment}
            className="relative flex flex-wrap gap-2 px-5"
          >
            <FaQuoteLeft className="text-gray-500 absolute top-0.5 left-0" />
            <span className="text-base text-gray-700 line-clamp-2 leading-relaxed italic relative">
              {comment.comment}
            </span>
            <FaQuoteRight className="text-gray-500 absolute bottom-0.5 right-0" />
          </blockquote>
          <div className="flex items-center justify-between gap-2 text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-sm" itemProp="author">
                - {comment.author}
              </span>

              <span className="flex items-center gap-1">
                <IoStar className="w-4 h-4 -mt-1 text-yellow-400" />
                <span className="font-medium text-sm">
                  {comment.rating.toFixed(1)}
                </span>
              </span>
            </div>

            <div className="text-xs text-gray-500">
              {formatDate(comment.comment_date)}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
