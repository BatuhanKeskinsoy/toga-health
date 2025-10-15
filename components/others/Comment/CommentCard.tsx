import React from "react";
import { getStar } from "@/lib/functions/getStar";
import ProfilePhoto from "../ProfilePhoto";
import { convertDate } from "@/lib/functions/getConvertDate";

interface CommentReply {
  id: number;
  comment_id: string;
  author: string;
  user: {
    id: number;
    name: string;
    photo: string;
    user_type: string;
  };
  comment: string;
  comment_date: string;
  created_at: string;
  is_verified: boolean;
}

interface CommentCardProps {
  id?: string;
  userName?: string;
  userAvatar?: string;
  rating?: number;
  comment?: string;
  date?: string;
  helpfulCount?: number;
  replyCount?: number;
  hasReply?: boolean;
  reply?: CommentReply | null;
}

function CommentCard({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  date,
  hasReply,
  reply,
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
    <div className="bg-white border border-gray-200 rounded-md lg:p-6 p-4">
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
      
      {/* Reply */}
      {hasReply && reply && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-sitePrimary/5 border-l-4 border-sitePrimary/80 p-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 min-w-8 rounded-md overflow-hidden">
                <ProfilePhoto
                  photo={reply.user.photo}
                  name={reply.author}
                  size={32}
                  fontSize={10}
                  responsiveSizes={{
                    desktop: 32,
                    mobile: 24,
                  }}
                  responsiveFontSizes={{
                    desktop: 10,
                    mobile: 8,
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-0.5 w-full">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 text-base line-clamp-1 w-full">
                    {reply.author}
                  </h4>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {convertDate(new Date(reply.created_at))}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {reply.comment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentCard;
