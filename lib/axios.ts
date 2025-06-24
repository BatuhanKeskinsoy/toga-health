import Axios, { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "@/constants";

// Server-side locale detection için helper fonksiyon
const getServerLocale = async (): Promise<string> => {
  try {
    const { getLocale } = await import("next-intl/server");
    const locale = await getLocale();
    return locale;
  } catch (error) {
    console.warn("Server locale detection failed, using fallback:", error);
    return "en"; // fallback locale
  }
};

// Locale'i normalize et (tr-TR -> tr, en-US -> en)
const normalizeLocale = (locale: string): string => {
  return locale.split('-')[0];
};

// Header'ları logla
/* const logHeaders = (headers: AxiosHeaders, context: string): void => {
  try {
    const rawHeaders = headers?.toJSON?.();
    console.log(`📦 ${context} Request Headers:`);
    Object.entries(rawHeaders || {}).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (err) {
    console.warn(`⚠️ ${context} header loglama başarısız:`, err);
  }
}; */

// Request interceptor'ı oluştur
const createRequestInterceptor = (isServerSide: boolean = false) => {
  return async (config: InternalAxiosRequestConfig) => {
    if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers || {});
    }

    // Client-side token ekleme
    if (!isServerSide && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // Server-side locale detection ve header ekleme
    if (isServerSide) {
      const currentLocale = config.headers.get("Accept-Language");
      if (!currentLocale || currentLocale === "en") {
        const locale = await getServerLocale();
        config.headers.set("Accept-Language", normalizeLocale(locale));
      }
    }

    //logHeaders(config.headers, isServerSide ? "Server" : "Client");

    return config;
  };
};

// Response interceptor'ı oluştur
const createResponseInterceptor = () => {
  return (response: any) => response;
};

// Error interceptor'ı oluştur
const createErrorInterceptor = () => {
  return (error: any) => {
    if (error.response) {
      if (error.response.status === 401) {
        // 401 hatasını sessizce yut, loglama!
        return Promise.reject(error);
      }
      console.error("❌ Response Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.response.config?.url,
        method: error.response.config?.method,
        data: error.response.data,
        fullError: error,
      });
    } else if (error.request) {
      console.error("❌ No response received:", {
        url: error.request.url,
        method: error.request.method,
      });
    } else {
      console.error("❌ Error setting up request:", error.message);
    }
    return Promise.reject(error);
  };
};

// Axios instance'ı oluştur ve interceptor'ları uygula
const createAxiosInstance = (config: {
  baseURL: string;
  headers: Record<string, string>;
  withCredentials?: boolean;
  withXSRFToken?: boolean;
  isServerSide?: boolean;
}): AxiosInstance => {
  const instance = Axios.create({
    baseURL: config.baseURL,
    headers: new AxiosHeaders(config.headers),
    withCredentials: config.withCredentials ?? true,
    withXSRFToken: config.withXSRFToken ?? true,
  });

  // Interceptor'ları ekle
  instance.interceptors.request.use(createRequestInterceptor(config.isServerSide));
  instance.interceptors.response.use(createResponseInterceptor(), createErrorInterceptor());

  return instance;
};

// Client-side axios instance oluştur
const createAxios = (locale: string): AxiosInstance => {
  const normalizedLocale = normalizeLocale(locale);
  
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language": normalizedLocale,
  };

  if (typeof window === "undefined") {
    headers["User-Agent"] = "Mozilla/5.0 (compatible; NextJS/1.0)";
  }

  return createAxiosInstance({
    baseURL,
    headers,
    isServerSide: false,
  });
};

// Server-side axios instance oluştur
const createServerAxios = async (): Promise<AxiosInstance> => {
  const locale = await getServerLocale();
  const normalizedLocale = normalizeLocale(locale);
  
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0 (compatible; NextJS/1.0)",
    "Accept-Language": normalizedLocale,
  };

  return createAxiosInstance({
    baseURL,
    headers,
    isServerSide: true,
  });
};

// Default axios instance
const axios = createAxiosInstance({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language": typeof window !== "undefined" 
      ? normalizeLocale(navigator.language) 
      : "en",
  },
  isServerSide: false,
});

// Token yönetimi
const setBearerToken = (token: string | null): void => {
  if (typeof window === "undefined") return;

  try {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.error("Token storage error:", error);
  }
};

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Token retrieval error:", error);
    return null;
  }
};

// CSRF token alma
const csrf = async (): Promise<void> => {
  try {
    await axios.get("/sanctum/csrf-cookie");
  } catch (error) {
    console.error("CSRF token alma hatası:", error);
    throw error;
  }
};

export {
  axios,
  createAxios,
  createServerAxios,
  setBearerToken,
  getToken,
  csrf,
};
