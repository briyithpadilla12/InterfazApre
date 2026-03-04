import axios from "axios";

const api = axios.create({
  baseURL: "http://healthymind10.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/** Callback para cerrar sesión cuando el token expira (401). */
let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (callback: (() => void) | null) => {
  onUnauthorized = callback;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Interceptor: 401 → cerrar sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export default api;