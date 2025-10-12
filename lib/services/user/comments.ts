import api from "@/lib/axios";
import type { UserCommentsResponse } from "@/lib/types/comments/UserCommentTypes";

export async function getUserComments(): Promise<UserCommentsResponse> {
  const res = await api.get(`/user/user-comments?per_page=9999`);
  return res.data;
}

export async function approveComment(commentId: number) {
  const res = await api.post(`/user/comments/${commentId}/approve`);
  return res.data;
}

export async function rejectComment(commentId: number) {
  const res = await api.post(`/user/comments/${commentId}/reject`);
  return res.data;
}

export async function replyToComment(commentId: number, reply: string) {
  const res = await api.post(`/user/comments/${commentId}/reply`, { reply });
  return res.data;
}
