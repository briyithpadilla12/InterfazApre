import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { setAuthToken } from "@/src/services/apiCliente"; // ajusta ruta

interface AuthContextType {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarToken = async () => {
      const tokenGuardado = await SecureStore.getItemAsync("token");
      if (tokenGuardado) {
        setToken(tokenGuardado);
        setAuthToken(tokenGuardado); 
      }
      setCargando(false);
    };
    cargarToken();
  }, []);

  const login = async (nuevoToken: string) => {
    await SecureStore.setItemAsync("token", nuevoToken);
    setToken(nuevoToken);
    setAuthToken(nuevoToken); 
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setAuthToken(null); 
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