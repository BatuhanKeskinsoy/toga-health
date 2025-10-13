import React from "react";
import { getUserComments } from "@/lib/services/user/comments";
import CommentTabs from "@/components/(front)/UserProfile/Comments/CommentTabs";
import ApprovedCommentsList from "@/components/(front)/UserProfile/Comments/ApprovedCommentsList";
import PendingCommentsList from "@/components/(front)/UserProfile/Comments/PendingCommentsList";
import RejectedCommentsList from "@/components/(front)/UserProfile/Comments/RejectedCommentsList";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";

export default async function CommentsPage() {
  let commentsData;

  try {
    commentsData = await getUserComments();
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-red-500 text-center">
          Yorumlar yüklenirken bir hata oluştu.
        </p>
      </div>
    );
  }

  // Yorumları kategorilere ayır
  const approvedComments = commentsData.data.filter(
    (comment: UserComment) => comment.is_approved && comment.is_active
  );

  const pendingComments = commentsData.data.filter(
    (comment: UserComment) => !comment.is_approved && comment.is_active
  );

  const rejectedComments = commentsData.data.filter(
    (comment: UserComment) => !comment.is_active
  );

  return (
    <>
      <CommentTabs
        approvedComments={<ApprovedCommentsList comments={approvedComments} />}
        pendingComments={<PendingCommentsList comments={pendingComments} />}
        rejectedComments={<RejectedCommentsList comments={rejectedComments} />}
        approvedCount={commentsData.meta.approved_count}
        pendingCount={commentsData.meta.pending_count}
        rejectedCount={commentsData.meta.rejected_count}
      />
    </>
  );
}
