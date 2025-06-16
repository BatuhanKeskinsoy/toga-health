import { baseURL } from "@/constants";
import { axios } from "@/lib/axios";

export async function getGeneralSettings() {
  try {
    const response = await axios.get(`${baseURL}/public/settings`);
    console.log("Scrolling Text :", response.data.data.scrolling_text);
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching generals:", error);
    throw error;
  }
}
