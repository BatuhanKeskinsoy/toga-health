import api from "@/lib/axios";
import { Specialty } from "@/lib/types/categories/specialtiesTypes";

export async function getBranches(): Promise<Specialty[]> {
  try {
    const response = await api.get(`/public/specialties?per_page=9999`);
    if (response.data.status) {
      return response.data.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching branches:",
      error.response?.data || error.message
    );
    throw error;
  }
}