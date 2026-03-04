import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { setAuthToken, setOnUnauthorized } from "@/src/services/apiCliente";

interface AuthContextType {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

SplashScreen.preventAutoHideAsync();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const logoutRef = useRef<(() => Promise<void>) | null>(null);

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setAuthToken(null);
  };

  logoutRef.current = logout;

  useEffect(() => {
    setOnUnauthorized(() => () => {
      logoutRef.current?.();
    });
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    const cargarToken = async () => {
      try {
        const tokenGuardado = await SecureStore.getItemAsync("token");
        if (tokenGuardado) {
          setToken(tokenGuardado);
          setAuthToken(tokenGuardado);
        }
      } catch (error) {
        console.warn("Error al cargar token:", error);
      } finally {
        setCargando(false);
        await SplashScreen.hideAsync();
      }
    };
    cargarToken();
  }, []);

  const login = async (nuevoToken: string) => {
    if (!nuevoToken) return;
    await SecureStore.setItemAsync("token", nuevoToken);
    setToken(nuevoToken);
    setAuthToken(nuevoToken);
  };

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