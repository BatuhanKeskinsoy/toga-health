import Axios, { AxiosHeaders } from "axios";
import { baseURL } from "@/constants";

const axios = Axios.create({
  baseURL,
  headers: new AxiosHeaders({
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent": "Mozilla/5.0",
  }),
  withCredentials: true,
  withXSRFToken: true,
});

let currentLocale: string | null = null;

function setLocale(locale: string) {
  currentLocale = locale;
}

axios.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  } else if (!(config.headers instanceof AxiosHeaders)) {
    config.headers = new AxiosHeaders(config.headers);
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (currentLocale) {
    config.headers.set("Accept-Language", currentLocale);
  }

  console.log("Outgoing request headers:", config.headers.toJSON());
  return config;
});

const setBearerToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const csrf = async () => axios.get("/sanctum/csrf-cookie");

export { axios, setBearerToken, getToken, csrf, setLocale };