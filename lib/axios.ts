import { baseURL } from "@/constants";
import Axios from "axios";

const axios = Axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

axios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
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

const getToken = (): string | null => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const csrf = async () => axios.get("/sanctum/csrf-cookie");

export { axios, getToken, setBearerToken, csrf };
