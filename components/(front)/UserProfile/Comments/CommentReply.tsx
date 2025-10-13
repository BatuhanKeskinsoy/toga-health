import React from "react";
import type { UserCommentReply } from "@/lib/types/comments/UserCommentTypes";
import { convertDate } from "@/lib/functions/getConvertDate";
import ProfilePhoto from "@/components/others/ProfilePhoto";

interface CommentReplyProps {
  reply: UserCommentReply;
}

export default function CommentReply({ reply }: CommentReplyProps) {
  return (
    <div className="bg-sitePrimary/5 border-l-4 border-sitePrimary/80 p-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 min-w-10 rounded-md overflow-hidden">
          <ProfilePhoto
            photo={reply.user.image_url}
            name={reply.author}
            size={40}
            fontSize={12}
            responsiveSizes={{
              desktop: 40,
              mobile: 24,
            }}
            responsiveFontSizes={{
              desktop: 12,
              mobile: 10,
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 w-full">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 w-full">
              {reply.author}
            </h4>
            <span className="text-[10px] text-gray-500 whitespace-nowrap">
              {convertDate(new Date(reply.created_at))}
            </span>
          </div>
          <p className="text-gray-700 text-xs leading-relaxed">
            {reply.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
