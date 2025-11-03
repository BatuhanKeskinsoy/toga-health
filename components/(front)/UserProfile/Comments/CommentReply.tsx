import React from "react";
import type { UserCommentReply } from "@/lib/types/comments/UserCommentTypes";
import { convertDate } from "@/lib/functions/getConvertDate";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { useLocale } from "next-intl";

interface CommentReplyProps {
  reply: UserCommentReply;
}

export default function CommentReply({ reply }: CommentReplyProps) {
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  return (
    <div className="bg-sitePrimary/5 border-l-4 border-sitePrimary/80 p-2">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 min-w-9 rounded-md overflow-hidden">
          <ProfilePhoto
            photo={reply.user.photo}
            name={reply.author}
            size={36}
            fontSize={12}
            responsiveSizes={{
              desktop: 36,
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
            <h4 className="font-semibold text-gray-900 text-xs line-clamp-1 w-full">
              {reply.author}
            </h4>
            <span className="text-[10px] text-gray-500 whitespace-nowrap">
              {convertDate(new Date(reply.created_at), fullLocale)}
            </span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            {reply.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
