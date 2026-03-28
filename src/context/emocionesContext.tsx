import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import EmocionesService, { type EmocionAPI } from "@/src/services/emocionesService";
import { useAuth } from "./authContext";

interface EmocionesContextType {
  emociones: EmocionAPI[];
  cargando: boolean;
  recargar: () => Promise<void>;
}

const EmocionesContext = createContext<EmocionesContextType | undefined>(undefined);

export const EmocionesProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [emociones, setEmociones] = useState<EmocionAPI[]>([]);
  const [cargando, setCargando] = useState(false);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      const lista = await EmocionesService.obtenerTodas();
      setEmociones(lista);
    } catch {
      /* mantener las que ya había */
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      recargar();
    } else {
      setEmociones([]);
    }
  }, [token, recargar]);

  return (
    <EmocionesContext.Provider value={{ emociones, cargando, recargar }}>
      {children}
    </EmocionesContext.Provider>
  );
};

export function useEmociones() {
  const ctx = useContext(EmocionesContext);
  if (!ctx) throw new Error("useEmociones debe usarse dentro de EmocionesProvider");
  return ctx;
}
