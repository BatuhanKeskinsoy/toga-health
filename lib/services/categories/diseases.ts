import api from "@/lib/axios";
import { Disease } from "@/lib/types/categories/diseasesTypes";

export async function getDiseases(): Promise<Disease[]> {
  try {
    const response = await api.get(`/public/diseases?per_page=9999`);
    if (response.data.status) {
      return response.data.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching diseases:",
      error.response?.data || error.message
    );
    throw error;
  }
}