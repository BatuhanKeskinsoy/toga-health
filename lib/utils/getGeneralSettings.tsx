import { axios } from "@/lib/axios";

export async function getGeneralSettings(locale: string) {
  try {
    const response = await axios.get(`/public/settings`, {
      headers: {
        "Accept-Language": locale,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching generals:",
      error.response?.data || error.message
    );
    throw error;
  }
}
