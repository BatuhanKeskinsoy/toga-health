import useSWR from "swr";
import { axios } from "@/lib/axios";

export function useNotifications() {
  const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    "/user/notifications",
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  return {
    notifications: data?.data || [],
    pagination: data || {},
    isLoading,
    isError: !!error,
    mutate,
  };
}
