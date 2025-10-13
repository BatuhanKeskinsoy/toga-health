"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import ProfileCommentCard from "./ProfileCommentCard";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { approveComment } from "@/lib/services/user/comments";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";

interface RejectedCommentsListProps {
  comments: UserComment[];
}

export default function RejectedCommentsList({
  comments: initialComments,
}: RejectedCommentsListProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState<number | null>(null);

  const handleApprove = async (commentId: number) => {
    try {
      setLoading(commentId);
      await approveComment(commentId);
      funcSweetAlert({
        title: "Başarılı!",
        text: "Yorum başarıyla onaylandı.",
        icon: "success",
      });
      // Yorumu listeden kaldır (approved'a geçti)
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      // Sayfayı yenile
      router.refresh();
    } catch (error: any) {
      funcSweetAlert({
        title: "Hata!",
        text:
          error?.response?.data?.message ||
          "Yorum onaylanırken bir hata oluştu.",
        icon: "error",
      });
    } finally {
      setLoading(null);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="flex flex-col max-lg:items-center items-start max-lg:justify-center justify-start">
        <p className="text-gray-500 text-center">
          Reddedilmiş yorum bulunmamaktadır.
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
            <button
              onClick={() => handleApprove(comment.id)}
              disabled={loading === comment.id}
              className="p-2 rounded-md text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Yeniden Onayla"
            >
              <IoCheckmarkCircleOutline className="w-6 h-6" />
            </button>
          }
        />
      ))}
    </>
  );
}
