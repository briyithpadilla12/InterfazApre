import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { setAuthToken, setOnUnauthorized, setRefreshProvider } from "@/src/services/apiCliente";
import AutenticacionUsuServices from "@/src/services/AutenticacionUsuServices";
import { isAccessTokenExpired, obtenerExpDesdeToken } from "@/src/utils/jwt";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh_token";

interface AuthContextType {
  token: string | null;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

SplashScreen.preventAutoHideAsync();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const logoutRef = useRef<(() => Promise<void>) | null>(null);
  const refreshLockRef = useRef<Promise<boolean> | null>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleProactiveRefreshRef = useRef<((t: string) => void) | null>(null);
  const refreshSessionRef = useRef<(() => Promise<boolean>) | null>(null);

  const logout = useCallback(async () => {
    if (proactiveTimerRef.current) {
      clearTimeout(proactiveTimerRef.current);
      proactiveTimerRef.current = null;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    setToken(null);
    setAuthToken(null);
  }, []);

  logoutRef.current = logout;

  const scheduleProactiveRefresh = useCallback((accessToken: string) => {
    if (proactiveTimerRef.current) {
      clearTimeout(proactiveTimerRef.current);
      proactiveTimerRef.current = null;
    }
    const exp = obtenerExpDesdeToken(accessToken);
    if (exp == null) return;
    const nowSec = Math.floor(Date.now() / 1000);
    const delaySec = exp - nowSec - 120;
    if (delaySec < 8) return;
    proactiveTimerRef.current = setTimeout(async () => {
      proactiveTimerRef.current = null;
      const ok = await refreshSessionRef.current?.();
      if (ok) {
        const t = await SecureStore.getItemAsync(TOKEN_KEY);
        if (t) scheduleProactiveRefreshRef.current?.(t);
      }
    }, delaySec * 1000);
  }, []);

  scheduleProactiveRefreshRef.current = scheduleProactiveRefresh;

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (refreshLockRef.current) return refreshLockRef.current;

    refreshLockRef.current = (async () => {
      try {
        const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
        if (!refresh) return false;

        const { token: newToken, refreshToken: newRefresh } =
          await AutenticacionUsuServices.RefrescarToken(refresh);

        await SecureStore.setItemAsync(TOKEN_KEY, newToken);
        await SecureStore.setItemAsync(REFRESH_KEY, newRefresh);
        setToken(newToken);
        setAuthToken(newToken);
        scheduleProactiveRefreshRef.current?.(newToken);
        return true;
      } catch {
        await logout();
        return false;
      } finally {
        refreshLockRef.current = null;
      }
    })();

    return refreshLockRef.current;
  }, [logout]);

  refreshSessionRef.current = refreshSession;

  useEffect(() => {
    setOnUnauthorized(() => () => {
      logoutRef.current?.();
    });
    setRefreshProvider(refreshSession);
    return () => {
      setOnUnauthorized(null);
      setRefreshProvider(null);
    };
  }, [refreshSession]);

  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const [tokenGuardado, refreshGuardado] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_KEY),
        ]);

        if (!tokenGuardado && !refreshGuardado) {
          setCargando(false);
          await SplashScreen.hideAsync();
          return;
        }

        let accessToken = tokenGuardado;

        if (tokenGuardado && isAccessTokenExpired(tokenGuardado, 60) && refreshGuardado) {
          const ok = await refreshSession();
          if (ok) {
            accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
          } else {
            setCargando(false);
            await SplashScreen.hideAsync();
            return;
          }
        } else if (tokenGuardado && isAccessTokenExpired(tokenGuardado, 0) && !refreshGuardado) {
          await logout();
          setCargando(false);
          await SplashScreen.hideAsync();
          return;
        }

        if (accessToken) {
          setToken(accessToken);
          setAuthToken(accessToken);
          scheduleProactiveRefreshRef.current?.(accessToken);
        }
      } catch (error) {
        console.warn("Error al cargar sesión:", error);
      } finally {
        setCargando(false);
        await SplashScreen.hideAsync();
      }
    };
    cargarSesion();
  }, [refreshSession, logout]);

  const login = useCallback(async (nuevoToken: string, refreshToken: string) => {
    if (!nuevoToken) return;
    await SecureStore.setItemAsync(TOKEN_KEY, nuevoToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
    setToken(nuevoToken);
    setAuthToken(nuevoToken);
    scheduleProactiveRefreshRef.current?.(nuevoToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return contexto;
};
