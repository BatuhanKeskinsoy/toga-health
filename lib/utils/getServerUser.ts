import { getServerToken } from "./cookies";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { baseURL } from "@/constants";
import api from "../axios";

/**
 * Server-side'da kullanıcı bilgilerini alır
 * Token varsa ve geçerliyse user bilgilerini döndürür
 */
export async function getServerUser(): Promise<UserTypes | null> {
  try {
    const token = await getServerToken();

    if (!token) {
      return null;
    }

    // Server-side'da doğrudan API'ye istek at
    const response = await api.get("/user/profile");
    const user = response.data.data;

    return user || null;
  } catch (error) {
    console.error("Server user alma hatası:", error);
    return null;
  }
}
