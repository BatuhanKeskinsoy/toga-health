import api from "@/lib/axios";

export interface SendContactRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function sendContact(data: SendContactRequest) {
  const res = await api.post(`/public/contacts`, data);
  return res.data;
}