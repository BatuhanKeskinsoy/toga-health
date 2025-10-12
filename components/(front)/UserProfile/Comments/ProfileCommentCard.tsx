import React from "react";
import { getStar } from "@/lib/functions/getStar";
import { getShortName } from "@/lib/functions/getShortName";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";
import { convertDate } from "@/lib/functions/getConvertDate";
import ProfilePhoto from "@/components/others/ProfilePhoto";

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
              <ProfilePhoto
                photo={comment.answer.image_url}
                name={comment.answer.name}
                size={48}
                fontSize={16}
                responsiveSizes={{
                  desktop: 48,
                  mobile: 32,
                }}
                responsiveFontSizes={{
                  desktop: 16,
                  mobile: 12,
                }}
              />
            ) : (
              <div className="w-full h-full bg-sitePrimary/10 flex items-center justify-center">
                <span className="text-sitePrimary font-medium uppercase text-sm">
                  {getShortName(comment.answer.name)}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 truncate">
                {comment.answer.name}
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

      {/* Reply Button */}
      {replyButton && (
        <div className="pt-3 border-t border-gray-200">{replyButton}</div>
      )}
    </div>
  );
}
