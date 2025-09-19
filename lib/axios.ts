import Axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { baseURL } from "@/constants";

// Server-side locale detection için helper fonksiyon - Cookie'den al
const getServerLocale = async (): Promise<string> => {
  try {
    // Sadece server-side'da çalış
    if (typeof window !== "undefined") {
      return "en"; // Client-side'da fallback
    }

    // App Router'da cookie'den locale al - Request scope kontrolü
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
      return locale;
    } catch (cookieError) {
      // Request scope dışındaysa fallback kullan (sessizce)
      return "en";
    }
  } catch (error) {
    // Genel hata durumunda fallback (sessizce)
    return "en";
  }
};

// Locale'i normalize et (tr-TR -> tr, en-US -> en)
const normalizeLocale = (locale: string): string => {
  return locale.split("-")[0];
};

// Request interceptor'ı oluştur - Her zaman server-side gibi davran
const createRequestInterceptor = () => {
  return async (config: InternalAxiosRequestConfig) => {
    if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers || {});
    }

    // Token ekleme (server-side'da cookie'den, client-side'da localStorage'dan)
    try {
      let token = null;
      
      if (typeof window === "undefined") {
        // Server-side: Cookie'den al ve ek header'ları ekle
        const { getServerToken } = await import("@/lib/utils/cookies");
        token = await getServerToken();
        
        // Server-side'da ek header'ları ekle
        config.headers.set("X-Requested-With", "XMLHttpRequest");
        config.headers.set("User-Agent", "NextJS-Server/1.0");
      } else {
        // Client-side: localStorage'dan al
        const { getToken } = await import("@/lib/utils/cookies");
        token = await getToken();
      }
      
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("Token alma hatası:", error);
    }

    // Locale detection ve header ekleme - Her zaman server-side gibi davran
    try {
      const currentLocale = config.headers.get("Accept-Language");
      if (!currentLocale || currentLocale === "en") {
        // Her zaman server-side locale detection kullan
        const locale = await getServerLocale();
        config.headers.set("Accept-Language", normalizeLocale(locale));
      }
    } catch (error) {
      console.error("Locale detection hatası:", error);
    }

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
      // 401 ve 404 hatalarını sessizce yut, loglama!
      if (error.response.status === 401 || error.response.status === 404) {
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

// Tek axios instance oluştur - Her zaman server-side gibi davran
const createAxiosInstance = async (): Promise<AxiosInstance> => {
  // Instance oluştururken sabit locale kullan (interceptor'da dinamik olacak)
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": "en", // Default locale, interceptor'da güncellenecek
  };

  const instance = Axios.create({
    baseURL,
    headers: new AxiosHeaders(headers),
    withCredentials: true,
    withXSRFToken: true,
  });

  // Interceptor'ları ekle
  instance.interceptors.request.use(createRequestInterceptor());
  instance.interceptors.response.use(
    createResponseInterceptor(),
    createErrorInterceptor()
  );

  return instance;
};

// Global axios instance - Lazy loading ile
let axiosInstance: AxiosInstance | null = null;

const getAxios = async (): Promise<AxiosInstance> => {
  if (!axiosInstance) {
    axiosInstance = await createAxiosInstance();
  }
  return axiosInstance;
};

// API wrapper - Her yerde kullanılacak
const api = {
  get: async (url: string, config?: any) => {
    const axios = await getAxios();
    return axios.get(url, config);
  },
  post: async (url: string, data?: any, config?: any) => {
    const axios = await getAxios();
    return axios.post(url, data, config);
  },
  put: async (url: string, data?: any, config?: any) => {
    const axios = await getAxios();
    return axios.put(url, data, config);
  },
  patch: async (url: string, data?: any, config?: any) => {
    const axios = await getAxios();
    return axios.patch(url, data, config);
  },
  delete: async (url: string, config?: any) => {
    const axios = await getAxios();
    return axios.delete(url, config);
  },
};

// Default axios instance (backward compatibility)
const axios = await createAxiosInstance();

// Token yönetimi (cookie tabanlı)
const setBearerToken = (
  token: string | null,
  rememberMe: boolean = false
): void => {
  if (typeof window === "undefined") return;

  try {
    if (token) {
      // Dynamic import kullan
      import("@/lib/utils/cookies").then(({ setClientToken }) => {
        setClientToken(token, rememberMe);
      });
    } else {
      // Dynamic import kullan
      import("@/lib/utils/cookies").then(({ deleteClientToken }) => {
        deleteClientToken();
      });
    }
  } catch (error) {
    console.error("Token storage error:", error);
  }
};

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const { getClientToken } = require("@/lib/utils/cookies");
    return getClientToken();
  } catch (error) {
    console.error("Token retrieval error:", error);
    return null;
  }
};

// CSRF token alma ( ÇALIŞMIYOR )
const csrf = async (): Promise<any> => {
  try {
    const csrf = await axios.post("/sanctum/csrf-cookie");
    return csrf;
  } catch (error) {
    console.error("CSRF token alma hatası:", error);
    throw error;
  }
};

export { api, axios, setBearerToken, getToken, csrf };

export default api;