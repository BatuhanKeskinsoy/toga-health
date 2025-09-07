import api from "@/lib/axios";

export async function notificationReadAll() {
  try {
    const response = await api.get(`/user/notifications/read-all`);
    return response;
  } catch (error: any) {
    console.error("Error Read:", error.response?.data || error.message);
    throw error;
  }
}
