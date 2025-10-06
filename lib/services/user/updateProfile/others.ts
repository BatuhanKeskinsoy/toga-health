import api from "@/lib/axios";

export async function changePassword(
  password: string,
  newPassword: string,
  newPasswordConfirmation: string
) {
  const res = await api.post(`/user/change-password`, {
    current_password: password,
    password: newPassword,
    password_confirmation: newPasswordConfirmation,
  });
  return res.data;
}

export async function updateEmail(
  new_email: string,
  verification_code: string
) {
  const res = await api.post(`/user/update-email`, {
    new_email,
    verification_code,
  });
  return res.data;
}

export async function sendEmailChangeCode(new_email: string) {
  const res = await api.post(`/user/send-email-change-code`, {
    new_email,
  });
  return res.data;
}

export async function updatePhone(
  phone_code: string,
  phone_number: string,
  verification_code: string
) {
  const res = await api.post(`/user/update-phone`, {
    phone_code,
    phone_number,
    verification_code,
  });
  return res.data;
}

export async function sendPhoneChangeCode(
  phone_code: string,
  phone_number: string
) {
  const res = await api.post(`/user/send-phone-change-code`, {
    phone_code,
    phone_number,
  });
  return res.data;
}
