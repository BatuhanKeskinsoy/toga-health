import api from "@/lib/axios";

export async function deleteProfilePhoto() {
  const res = await api.delete(`/user/delete-photo`);
  return res.data;
}
