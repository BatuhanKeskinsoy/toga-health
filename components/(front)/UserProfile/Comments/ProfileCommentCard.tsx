import React from "react";
import { getStar } from "@/lib/functions/getStar";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";
import { convertDate } from "@/lib/functions/getConvertDate";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import CommentReply from "./CommentReply";
import { IoCloseCircleOutline } from "react-icons/io5";

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
    <div className="bg-white border border-gray-200 rounded-md p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 min-w-12 rounded-md overflow-hidden">
            <ProfilePhoto
              photo={comment.user.image_url}
              name={comment.author}
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
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 w-full">
              <h4 className="font-semibold text-gray-900 line-clamp-1 w-full">
                {comment.author}
              </h4>
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

      {/* Rejection Info */}
      {comment.rejection_info && (
        <>
          <hr className="my-3 border-gray-200" />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Red Sebebi</label>
            <div className="w-full bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-500">
                {comment.rejection_info.rejection_description}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pt-3 border-t border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Yanıtlar ({comment.replies.length})
          </h4>
          <div className="flex flex-col gap-2 w-full">
            {comment.replies.map((reply) => (
              <CommentReply key={reply.id} reply={reply} />
            ))}
          </div>
        </div>
      )}

      {/* Reply Button */}
      {replyButton && (
        <div className="pt-3 mt-3 border-t border-gray-200">{replyButton}</div>
      )}
    </div>
  );
}
