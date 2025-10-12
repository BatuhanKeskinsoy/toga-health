import api from "@/lib/axios";
import type { UserCommentsResponse } from "@/lib/types/comments/UserCommentTypes";

export async function getUserComments(): Promise<UserCommentsResponse> {
  const res = await api.get(`/user/user-comments?per_page=9999`);
  return res.data;
}

export async function approveComment(commentId: number) {
  const res = await api.post(`/user/provider-comments/${commentId}/approve`, {
    action: "approve",
  });
  return res.data;
}

export async function rejectComment(
  commentId: number,
  notifyUser: boolean,
  rejectionReason: string
) {
  const res = await api.post(`/user/provider-comments/${commentId}/reject`, {
    notify_user: notifyUser,
    rejection_reason: rejectionReason,
  });
  return res.data;
}

export async function replyToComment(commentId: number, reply: string) {
  const res = await api.post(`/user/provider-comments/${commentId}/reply`, {
    comment: reply,
  });
  return res.data;
}
