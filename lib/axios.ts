import Axios, { AxiosHeaders, type AxiosInstance } from "axios";
import { baseURL } from "@/constants";

const applyInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
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

    return config;
  });

  return instance;
};

const createAxios = (locale: string): AxiosInstance => {
  const instance = Axios.create({
    baseURL,
    headers: new AxiosHeaders({
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0",
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
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0",
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

export { axios, createAxios, setBearerToken, getToken, csrf };
