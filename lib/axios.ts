import { baseURL } from "@/constants";
import Axios from "axios";

const axios = Axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

const setBearerToken = (token: string | null) => {
  if (token === null) {
    axios.defaults.headers.common["Authorization"] = null;
    typeof window !== "undefined" && localStorage.removeItem("token");
    return;
  }

  typeof window !== "undefined" && localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

let token = getToken();
setBearerToken(token);

const csrf = async () => axios.get("/sanctum/csrf-cookie");

export { axios, getToken, setBearerToken, csrf };
