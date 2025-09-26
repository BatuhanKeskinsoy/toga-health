import api from "@/lib/axios";

export async function sendComment(
  receiver_id: number,
  rating: number,
  comment: string
) {
  const res = await api.post(`/comments/create`, {
    receiver_id,
    rating,
    comment,
  });
  console.log(res);
  return res.data;
}
