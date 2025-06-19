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
      dedupingInterval: 30000,
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutateUser: mutate,
  };
}
