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
    if (typeof window === "undefined") {
      const currentLocale = config.headers.get("Accept-Language");
      if (!currentLocale || currentLocale === "en") {
        const locale = await getServerLocale();
        config.headers.set("Accept-Language", locale);
      }
    }

    console.log("📦 Request Headers:");
    try {
      const rawHeaders = config.headers?.toJSON?.();
      Object.entries(rawHeaders || {}).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    } catch (err) {
      console.warn("⚠️ Header loglama başarısız:", err);
    }

    return config;
  });

  return instance;
};


const createAxios = (locale: string): AxiosInstance => {
  // Locale'i sadece dil kodu olarak al (tr-TR -> tr, en-US -> en)
  const languageCode = locale.split('-')[0];
  
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language": languageCode,
  };

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

  // Server-side için özel interceptor ekle
  instance.interceptors.request.use(async (config) => {
    if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers || {});
    }

    // Server-side locale detection
    const currentLocale = config.headers.get("Accept-Language");
    if (!currentLocale || currentLocale === "en") {
      const locale = await getServerLocale();
      config.headers.set("Accept-Language", locale);
    }

    console.log("📦 Server Request Headers:");
    try {
      const rawHeaders = config.headers?.toJSON?.();
      Object.entries(rawHeaders || {}).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    } catch (err) {
      console.warn("⚠️ Header loglama başarısız:", err);
    }

    return config;
  });

  return instance;
};

const axios = Axios.create({
  baseURL,
  headers: new AxiosHeaders({
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language":
      typeof window !== "undefined" ? navigator.language.split('-')[0] : "en",
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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("❌ Response Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export {
  axios,
  createAxios,
  createServerAxios,
  setBearerToken,
  getToken,
  csrf,
};
