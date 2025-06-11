import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";

export async function deleteProfilePhoto() {
  const res = await axios.delete(`${baseURL}/user/delete-photo`);
  return res.data;
}
