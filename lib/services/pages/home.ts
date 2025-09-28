import api from "@/lib/axios";
import { HomeResponse } from "@/lib/types/pages/homeTypes";

export const getHome = async (): Promise<HomeResponse> => {
  try {
    const response = await api.get("/public/home");
    return response.data;
  } catch (error) {
    console.error("Get home API error:", error);
    throw error;
  }
};