"use client";

import { useState } from "react";
import ProfileCommentCard from "./ProfileCommentCard";
import InlineReplyForm from "./InlineReplyForm";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";

interface ApprovedCommentsListProps {
  comments: UserComment[];
}

export default function ApprovedCommentsList({
  comments: initialComments,
}: ApprovedCommentsListProps) {
  const [comments] = useState(initialComments);

  if (comments.length === 0) {
    return (
      <div className="flex flex-col max-lg:items-center items-start max-lg:justify-center justify-start">
        <p className="text-gray-500 text-center">
          Henüz onaylanmış yorum bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <ProfileCommentCard
          key={comment.id}
          comment={comment}
          replyButton={<InlineReplyForm commentId={comment.id} />}
        />
      ))}
    </>
  );
}
