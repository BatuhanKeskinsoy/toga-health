"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { UserTypes } from "@/lib/types/user/UserTypes";

const fetcher = (url: string): Promise<UserTypes> => {
  return axios.get(url).then((res) => res.data.user);
};

export function useUser() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const token = isClient ? localStorage.getItem("token") : null;
  const { data, error, isLoading, mutate } = useSWR<UserTypes>(
    isClient && token ? "/user/profile" : null,
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutateUser: mutate,
  };
}
