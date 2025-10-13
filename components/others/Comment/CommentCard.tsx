import React from "react";
import { getStar } from "@/lib/functions/getStar";
import ProfilePhoto from "../ProfilePhoto";

interface CommentCardProps {
  id?: string;
  userName?: string;
  userAvatar?: string;
  rating?: number;
  comment?: string;
  date?: string;
  helpfulCount?: number;
  replyCount?: number;
}

function CommentCard({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  date,
}: CommentCardProps) {
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
    <div className="bg-white border border-gray-200 rounded-lg lg:p-6 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative lg:min-w-14 lg:w-14 lg:h-14 w-12 h-12 min-w-12 rounded-md overflow-hidden">
            <ProfilePhoto
              photo={userAvatar}
              name={userName}
              size={56}
              fontSize={16}
              responsiveSizes={{ desktop: 56, mobile: 48 }}
              responsiveFontSizes={{ desktop: 16, mobile: 12 }}
            />
          </div>
          {/* User Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{userName}</h4>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(rating)}
              <span className="text-sm text-gray-500 font-medium">
                ({rating})
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment}</p>
    </div>
  );
}

export default CommentCard;
