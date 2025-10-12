"use client";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import ProfileCommentCard from "./ProfileCommentCard";
import CommentActions from "./CommentActions";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";

interface PendingCommentsListProps {
  comments: UserComment[];
}

export default function PendingCommentsList({
  comments: initialComments,
}: PendingCommentsListProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);

  const handleApprove = (commentId: number) => {
    // Yorumu listeden kaldır (approved'a geçti)
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    // Sayfayı yenile (server-side data güncellemesi için)
    router.refresh();
  };

  const handleReject = (commentId: number) => {
    // Yorumu listeden kaldır (rejected'a geçti)
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    // Sayfayı yenile (server-side data güncellemesi için)
    router.refresh();
  };

  if (comments.length === 0) {
    return (
      <div className="flex flex-col max-lg:items-center items-start max-lg:justify-center justify-start">
        <p className="text-gray-500 text-center">
          Onay bekleyen yorum bulunmamaktadır.
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
          actions={
            <CommentActions
              commentId={comment.id}
              commentAuthor={comment.author}
              onApprove={() => handleApprove(comment.id)}
              onReject={() => handleReject(comment.id)}
            />
          }
        />
      ))}
    </>
  );
}
