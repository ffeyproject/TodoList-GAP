// lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.99.230:8000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // hapus token biar bersih
      localStorage.removeItem("token");

      // lempar event biar bisa didengar di komponen
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized"));
      }
    }
    // jangan spam panjang, cukup log ringkas
    console.warn("API Unauthorized (401) - redirect ke login");
    return Promise.reject(error);
  }
);

export default api;
