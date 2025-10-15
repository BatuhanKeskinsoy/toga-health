import React, { useState } from "react";
import { getStar } from "@/lib/functions/getStar";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";
import { convertDate } from "@/lib/functions/getConvertDate";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import CommentReply from "./CommentReply";
import InlineReplyForm from "./InlineReplyForm";
import { IoCloseCircleOutline, IoCreateOutline } from "react-icons/io5";
import CustomButton from "@/components/others/CustomButton";

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
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [currentReply, setCurrentReply] = useState(comment.reply);
  const [hasReply, setHasReply] = useState(comment.has_reply);

  const handleReplySuccess = (replyText: string) => {
    // Yanıt başarıyla gönderildi/güncellendi
    const updatedReply = {
      ...currentReply,
      comment: replyText,
      updated_at: new Date().toISOString(),
    };

    setCurrentReply(updatedReply);
    setHasReply(true);
    setShowReplyForm(false);
  };
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
    <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-md p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 min-w-12 rounded-md overflow-hidden">
            <ProfilePhoto
              photo={comment.user.photo}
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
      <p className="text-gray-700 leading-relaxed">{comment.comment}</p>

      {/* Rejection Info */}
      {comment.rejected_report && (
        <>
          <hr className="border-gray-200" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Red Sebebi</label>
            <div className="w-full bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-500">
                {comment.rejected_report.report_description}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Replies - Sadece onaylanmış yorumlarda göster */}
      {hasReply && currentReply && comment.is_approved && !showReplyForm && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CommentReply reply={currentReply} />
            </div>
            <button
              onClick={() => setShowReplyForm(true)}
              className="flex flex-col items-center gap-1 text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
            >
              <IoCreateOutline className="size-5 min-w-5" />
              Düzenle
            </button>
          </div>
        </div>
      )}

      {/* Reply Form - Sadece onaylanmış yorumlarda göster */}
      {comment.is_approved && (!hasReply || showReplyForm) && (
        <div className="pt-3 border-t border-gray-200">
          <InlineReplyForm
            commentId={comment.id}
            onReplySuccess={handleReplySuccess}
            existingReply={currentReply}
            isUpdate={hasReply}
          />
        </div>
      )}
    </div>
  );
}
