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
  const approvedComments = commentsData.data.data.filter(
    (comment: UserComment) => comment.is_approved
  );

  const pendingComments = commentsData.data.data.filter(
    (comment: UserComment) => !comment.is_approved && comment.is_active
  );

  const rejectedComments = commentsData.data.data.filter(
    (comment: UserComment) => comment.rejected_report !== null
  );

  return (
    <>
      <CommentTabs
        approvedComments={<ApprovedCommentsList comments={approvedComments} />}
        pendingComments={<PendingCommentsList comments={pendingComments} />}
        rejectedComments={<RejectedCommentsList comments={rejectedComments} />}
        approvedCount={commentsData.statistics.approved_comments}
        pendingCount={commentsData.statistics.pending_comments}
        rejectedCount={commentsData.statistics.rejected_comments}
        approvedPaginationData={commentsData.data}
      />
    </>
  );
}
