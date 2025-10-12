import api from "@/lib/axios";

export async function getUserComments() {
  const res = await api.get(`/user/user-comments?per_page=9999`);
  return res.data;
}
