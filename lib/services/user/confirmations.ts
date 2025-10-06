import api from "@/lib/axios";

export async function applyProfessionalAccount(data: FormData) {
  try {
    const res = await api.post(`user/type/apply`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error("Professional account application error:", error);
    throw error;
  }
}