import useSWR from "swr";
import { axios } from "@/lib/axios";
import { baseURL } from "@/constants";

export type Language = {
  id: number;
  name: string;
  code: string;
  direction: "ltr" | "rtl";
};

const fetchLanguages = async (): Promise<Language[]> => {
  const res = await axios.get(`${baseURL}/public/languages`);
  return res.data?.data || [];
};

export function useLanguages() {
  const { data, error, isLoading } = useSWR("languages", fetchLanguages);
  return {
    languages: data || [],
    isLoading,
    isError: error,
  };
}
