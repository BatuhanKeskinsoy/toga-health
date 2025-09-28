import api from "@/lib/axios";

export const getHome = async (
  params?: any
): Promise<any> => {
  try {
    const response = await api.get("/public/home", { params });
    return response.data;
  } catch (error) {
    console.error("Get home API error:", error);
    throw error;
  }
};