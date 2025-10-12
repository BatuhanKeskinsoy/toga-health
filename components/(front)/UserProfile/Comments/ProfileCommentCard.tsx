import React from "react";
import { getStar } from "@/lib/functions/getStar";
import { getShortName } from "@/lib/functions/getShortName";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";
import { convertDate } from "@/lib/functions/getConvertDate";

interface ProfileCommentCardProps {
  comment: UserComment;
  actions?: React.ReactNode;
  replyButton?: React.ReactNode;
}

export default function ProfileCommentCard({
  comment,
  actions,
  replyButton,
}: ProfileCommentCardProps) {
  const renderStars = (rating: number) => {
    const size = 16;
    return (
      <div className="flex gap-1 items-center min-w-max">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`relative min-w-[${size}px] w-[${size}px] h-[${size}px]`}
          >
            {getStar(index + 1, rating, size)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 min-w-12 rounded-md overflow-hidden">
            {comment.answer?.image_url ? (
              <img
                src={comment.answer.image_url}
                alt={comment.author}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full bg-sitePrimary/10 flex items-center justify-center"><span class="text-sitePrimary font-medium uppercase text-sm">${getShortName(
                      comment.author
                    )}</span></div>`;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-sitePrimary/10 flex items-center justify-center">
                <span className="text-sitePrimary font-medium uppercase text-sm">
                  {getShortName(comment.author)}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 truncate">
                {comment.author}
              </h4>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {convertDate(new Date(comment.comment_date))}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(comment.rating || 0)}
              <span className="text-sm text-gray-500 font-medium">
                ({comment.rating})
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {actions && <div className="flex items-start">{actions}</div>}
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-3">{comment.comment}</p>

      {/* Status Badges */}
      {comment.is_verified && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Doğrulanmış
          </span>
        </div>
      )}

      {/* Reply Button */}
      {replyButton && (
        <div className="pt-3 border-t border-gray-200">{replyButton}</div>
      )}
    </div>
  );
}

