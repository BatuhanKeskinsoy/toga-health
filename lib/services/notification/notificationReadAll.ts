import api from "@/lib/axios";

export async function notificationReadAll() {
  try {
    const response = await api.post(`/user/notifications/mark-all-read`);
    return response;
  } catch (error: any) {
    console.error("Error Read:", error.response?.data || error.message);
    throw error;
  }
}
