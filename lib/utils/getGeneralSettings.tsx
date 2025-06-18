import { getLocale } from "next-intl/server";
import { createAxios } from "@/lib/axios";

export async function getGeneralSettings() {
  const locale = await getLocale();
  const axios = createAxios(locale);
  try {
    const response = await axios.get(`/public/settings`);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error fetching generals:",
      error.response?.data || error.message
    );
    throw error;
  }
}
