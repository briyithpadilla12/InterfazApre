import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import EmocionesService, { type EmocionAPI } from "@/src/services/emocionesService";
import { useAuth } from "./authContext";

interface EmocionesContextType {
  emociones: EmocionAPI[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}

const EmocionesContext = createContext<EmocionesContextType | undefined>(undefined);

export const EmocionesProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [emociones, setEmociones] = useState<EmocionAPI[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const lista = await EmocionesService.obtenerTodas();
      setEmociones(lista);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudieron cargar las emociones";
      setError(msg);
      setEmociones([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      recargar();
    } else {
      setEmociones([]);
      setError(null);
    }
  }, [token, recargar]);

  return (
    <EmocionesContext.Provider value={{ emociones, cargando, error, recargar }}>
      {children}
    </EmocionesContext.Provider>
  );
};

export function useEmociones() {
  const ctx = useContext(EmocionesContext);
  if (!ctx) throw new Error("useEmociones debe usarse dentro de EmocionesProvider");
  return ctx;
}
