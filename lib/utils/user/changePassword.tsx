import { axios } from "@/lib/axios";

export async function changePassword(
  password: string,
  newPassword: string,
  newPasswordConfirmation: string
) {
  const res = await axios.post(`/user/change-password`, {
    current_password: password,
    new_password: newPassword,
    new_password_confirmation: newPasswordConfirmation,
  });
  return res.data;
}
