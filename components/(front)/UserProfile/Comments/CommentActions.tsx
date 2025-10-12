"use client";

import { useState } from "react";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { approveComment, rejectComment } from "@/lib/services/user/comments";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import RejectCommentModal from "./RejectCommentModal";

interface CommentActionsProps {
  commentId: number;
  commentAuthor: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function CommentActions({
  commentId,
  commentAuthor,
  onApprove,
  onReject,
}: CommentActionsProps) {
  const [loading, setLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveComment(commentId);
      funcSweetAlert({
        title: "Başarılı!",
        text: "Yorum başarıyla onaylandı.",
        icon: "success",
      });
      onApprove?.();
    } catch (error: any) {
      funcSweetAlert({
        title: "Hata!",
        text: error?.response?.data?.message || "Yorum onaylanırken bir hata oluştu.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async (notifyUser: boolean, reason: string) => {
    try {
      setLoading(true);
      await rejectComment(commentId, notifyUser, reason);
      funcSweetAlert({
        title: "Başarılı!",
        text: "Yorum reddedildi.",
        icon: "success",
      });
      onReject?.();
    } catch (error: any) {
      funcSweetAlert({
        title: "Hata!",
        text: error?.response?.data?.message || "Yorum reddedilirken bir hata oluştu.",
        icon: "error",
      });
      throw error; // Modal'ın loading state'ini durdurmak için
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Onayla"
        >
          <IoCheckmarkCircleOutline className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsRejectModalOpen(true)}
          disabled={loading}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reddet"
        >
          <IoCloseCircleOutline className="w-6 h-6" />
        </button>
      </div>

      <RejectCommentModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        commentAuthor={commentAuthor}
      />
    </>
  );
}

