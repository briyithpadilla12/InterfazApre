import { useCallback, useState } from "react";
import { crearReporte } from "@/src/services/reporteService";
import type { PrioridadReporte } from "@/src/models/reporte";
import {
  OPCIONES_PRIORIDAD,
  PRIORIDAD_POR_DEFECTO,
} from "@/src/models/reporte";

function extraerMensajeError(err: unknown): string {
  if (typeof err === "string") return err;
  const axiosErr = err as {
    response?: { data?: unknown; status?: number };
    message?: string;
  };
  if (axiosErr.message === "Network Error" || axiosErr.message?.includes("timeout")) {
    return "Sin conexión. Revisa tu internet e intenta de nuevo.";
  }
  const data = axiosErr.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  if (axiosErr.response?.status === 403) {
    return "No tienes permiso para enviar un reporte con esta sesión.";
  }
  return "No se pudo enviar el reporte. Intenta de nuevo.";
}

export function useReportarProblemaViewModel() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState<PrioridadReporte>(PRIORIDAD_POR_DEFECTO);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTitulo("");
    setDescripcion("");
    setCategoria("");
    setPrioridad(PRIORIDAD_POR_DEFECTO);
    setError(null);
  }, []);

  const validar = useCallback((): string | null => {
    if (!titulo.trim()) return "Escribe un título para el reporte.";
    if (!descripcion.trim()) return "Describe el problema con detalle.";
    if (!categoria.trim()) return "Indica una categoría o tipo de problema.";
    return null;
  }, [titulo, descripcion, categoria]);

  const enviar = useCallback(async (): Promise<boolean> => {
    const msg = validar();
    if (msg) {
      setError(msg);
      return false;
    }
    setCargando(true);
    setError(null);
    try {
      await crearReporte({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria.trim(),
        prioridad,
      });
      return true;
    } catch (e) {
      setError(extraerMensajeError(e));
      return false;
    } finally {
      setCargando(false);
    }
  }, [titulo, descripcion, categoria, prioridad, validar]);

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    categoria,
    setCategoria,
    prioridad,
    setPrioridad,
    prioridades: OPCIONES_PRIORIDAD,
    cargando,
    error,
    setError,
    reset,
    validar,
    enviar,
  };
}
