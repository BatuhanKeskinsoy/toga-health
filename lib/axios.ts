import Axios, { AxiosHeaders, type AxiosInstance } from "axios";
import { baseURL } from "@/constants";

// Server-side locale detection için helper fonksiyon
const getServerLocale = async (): Promise<string> => {
  try {
    const { getLocale } = await import("next-intl/server");
    const locale = await getLocale();
    return locale;
  } catch (error) {
    return "en"; // fallback locale
  }
};

const applyInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers || {});
    }

    // Client-side token ekleme
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // Server-side locale detection ve header ekleme
    // Sadece Accept-Language header'ı yoksa veya "en" ise locale detection yap
    if (typeof window === "undefined") {
      const currentLocale = config.headers.get("Accept-Language");
      if (!currentLocale || currentLocale === "en") {
        const locale = await getServerLocale();
        config.headers.set("Accept-Language", locale);
      }
    }

    return config;
  });

  return instance;
};

const createAxios = (locale: string): AxiosInstance => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language": locale,
  };

  // Sadece server-side tarafında User-Agent ekle
  if (typeof window === "undefined") {
    headers["User-Agent"] = "Mozilla/5.0 (compatible; NextJS/1.0)";
  }

  const instance = Axios.create({
    baseURL,
    headers: new AxiosHeaders(headers),
    withCredentials: true,
    withXSRFToken: true,
  });

  return applyInterceptors(instance);
};

// Server-side için otomatik locale detection ile axios instance
const createServerAxios = async (): Promise<AxiosInstance> => {
  const locale = await getServerLocale();
  const instance = Axios.create({
    baseURL,
    headers: new AxiosHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (compatible; NextJS/1.0)",
      "Accept-Language": locale,
    }),
    withCredentials: true,
    withXSRFToken: true,
  });

  return applyInterceptors(instance);
};

const axios = Axios.create({
  baseURL,
  headers: new AxiosHeaders({
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language":
      typeof window !== "undefined" ? navigator.language : "en",
  }),
  withCredentials: true,
  withXSRFToken: true,
});

applyInterceptors(axios);

const setBearerToken = (token: string | null) => {
  if (typeof window === "undefined") return;

  token
    ? localStorage.setItem("token", token)
    : localStorage.removeItem("token");
};

const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const csrf = async () => axios.get("/sanctum/csrf-cookie");

export { axios, createAxios, createServerAxios, setBearerToken, getToken, csrf };
