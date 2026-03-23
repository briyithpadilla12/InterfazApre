import axios, { type InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = "http://healthymind10.runasp.net/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/** Callback para cerrar sesión cuando el token expira y no se puede refrescar. */
let onUnauthorized: (() => void) | null = null;

/** Función para intentar refrescar el token ante 401. Devuelve true si se refrescó correctamente. */
let refreshProvider: (() => Promise<boolean>) | null = null;

export const setOnUnauthorized = (callback: (() => void) | null) => {
  onUnauthorized = callback;
};

export const setRefreshProvider = (provider: (() => Promise<boolean>) | null) => {
  refreshProvider = provider;
};

/** Intenta refrescar el token. Útil para servicios que usan fetch (ej. chatService). */
export const tryRefreshToken = async (): Promise<boolean> => {
  if (refreshProvider) return refreshProvider();
  return false;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

let isRefreshing = false;
type QueuedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let failedQueue: QueuedRequest[] = [];

const processQueue = (err: unknown, tokenRefreshed = false) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (err) {
      reject(err);
    } else if (tokenRefreshed) {
      resolve(api(config));
    } else {
      reject(err);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      processQueue(error, false);
      onUnauthorized?.();
      return Promise.reject(error);
    }

    if (!refreshProvider) {
      onUnauthorized?.();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const ok = await refreshProvider();
      if (ok) {
        processQueue(null, true);
        return api(originalRequest);
      }
    } catch (e) {
      processQueue(e, false);
    } finally {
      isRefreshing = false;
    }

    onUnauthorized?.();
    return Promise.reject(error);
  }
);

export default api;
