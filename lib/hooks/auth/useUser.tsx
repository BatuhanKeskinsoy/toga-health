"use client";
import useSWR from "swr";
import { axios } from "@/lib/axios";
import { UserTypes } from "@/types/user/UserTypes";

const fetcher = (url: string): Promise<UserTypes> =>
  axios.get(url).then((res) => res.data.user);

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserTypes>(
    "/user/profile",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutateUser: mutate,
  };
}
