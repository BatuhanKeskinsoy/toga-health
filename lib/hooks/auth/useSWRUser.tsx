"use client";
import useSWR from "swr";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { axios } from "@/lib/axios";
import { mutate as globalMutate } from "swr";

// SWR fetcher function
const fetcher = async (url: string): Promise<UserTypes | null> => {
  try {
    const response = await axios.get(url);
    return response.data.user || null;
  } catch (error: any) {
    // 401 hatası normal (logout sonrası token yok)
    if (error?.response?.status === 401) {
      console.log("User fetch 401 - token yok, null döndürülüyor");
      return null;
    }
    console.error("User fetch error:", error);
    return null;
  }
};

export function useSWRUser() {
  const { data: user, error, isLoading, mutate } = useSWR<UserTypes | null>(
    null, // Hiçbir zaman API çağrısı yapma, sadece manuel güncelleme
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1,
      errorRetryInterval: 1000,
      dedupingInterval: 0,
    }
  );

  // User'ı güncellemek için mutate fonksiyonu
  const updateUser = (newUser: UserTypes | null) => {
    console.log("SWR updateUser çağrıldı:", newUser);
    mutate(newUser, { revalidate: false });
  };

  // User'ı temizlemek için
  const clearUser = () => {
    console.log("SWR clearUser çağrıldı");
    // Local hook'u temizle
    mutate(null, { revalidate: false });
    // Global SWR cache'ini temizle
    globalMutate("/user/profile", null, { revalidate: false });
  };

  return {
    user,
    error,
    isLoading,
    updateUser,
    clearUser,
    mutate,
  };
}