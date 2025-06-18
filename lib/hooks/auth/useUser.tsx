"use client";
import useSWR from "swr";
import { axios } from "@/lib/axios";
import { UserTypes } from "@/lib/types/user/UserTypes";

const fetcher = (url: string): Promise<UserTypes> => {
  return axios.get(url).then((res) => res.data.user);
};

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserTypes>(
    "/user/profile",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30 saniye
      refreshInterval: 0, // Otomatik refresh yok
      errorRetryCount: 1,
      errorRetryInterval: 1000,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutateUser: mutate,
  };
}
