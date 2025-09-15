import api from "@/lib/axios";
import { Treatment } from "@/lib/types/categories/treatmentsTypes";

export async function getTreatments(): Promise<Treatment[]> {
  try {
    const response = await api.get(`/public/treatments?per_page=9999`);
    if (response.data.status) {
      return response.data.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching treatments:",
      error.response?.data || error.message
    );
    throw error;
  }
}