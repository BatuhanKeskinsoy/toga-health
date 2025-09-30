import api from "@/lib/axios";

export async function notificationRead(id: string) {
  try {
    const response = await api.post(`/user/notification/${id}/mark-as-read`);
    return response;
  } catch (error: any) {
    console.error("Error Read:", error.response?.data || error.message);
    throw error;
  }
}
