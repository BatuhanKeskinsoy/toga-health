import { axios } from "@/lib/axios";

export async function deleteProfilePhoto() {
  const res = await axios.delete(`/user/delete-photo`);
  return res.data;
}
