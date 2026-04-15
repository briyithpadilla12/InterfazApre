import { useState } from "react";
import PaginaDiarioService from "../services/paginaDiarioService";
import { PaginaDiario, type PaginaDiarioEditarPayload } from "../models/paginaDiario";

function extraerMensajeError(err: unknown): string {
  if (typeof err === "string") return err;
  const axiosErr = err as { response?: { data?: unknown }; message?: string };
  if (axiosErr.message === "Network Error" || axiosErr.message?.includes("timeout")) {
    return "Sin conexión. Revisa tu internet";
  }
  const data = axiosErr.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "message" in data && typeof (data as { message: unknown }).message === "string") {
    return (data as { message: string }).message;
  }
  return "No se pudo guardar la página del diario. Intenta de nuevo.";
}

export function usePaginaDiarioViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const reset = () => {
    setError(null);
    setExito(false);
  };

  const validar = (p: PaginaDiario): string | null => {
    if (!p.pagTitulo.trim()) return "La página necesita un título";
    if (!p.pagContenido.trim()) return "Escribe algo en tu diario";
    if (!p.pagDiarioFk) return "No se encontró tu diario";
    if (!p.pagEmocionFk) return "Selecciona una emoción";
    return null;
  };

  const validarEdicion = (p: PaginaDiarioEditarPayload): string | null => {
    if (!p.pagTitulo.trim()) return "La página necesita un título";
    if (!p.pagContenido.trim()) return "Escribe algo en tu diario";
    if (!p.pagDiarioFk) return "No se encontró tu diario";
    if (!p.pagEmocionFk) return "Selecciona una emoción";
    return null;
  };

  const guardarPagina = async (p: PaginaDiario): Promise<boolean> => {
    const msg = validar(p);
    if (msg) {
      setError(msg);
      setExito(false);
      return false;
    }

    setCargando(true);
    setError(null);
    setExito(false);

    try {
      await PaginaDiarioService.crearPagina(p);
      setExito(true);
      return true;
    } catch (err) {
      setError(extraerMensajeError(err));
      return false;
    } finally {
      setCargando(false);
    }
  };

  const actualizarPagina = async (
    id: number,
    payload: PaginaDiarioEditarPayload
  ): Promise<{ ok: true } | { ok: false; error: string }> => {
    const msg = validarEdicion(payload);
    if (msg) {
      setError(msg);
      setExito(false);
      return { ok: false, error: msg };
    }
    setCargando(true);
    setError(null);
    setExito(false);
    try {
      await PaginaDiarioService.editarPagina(id, payload);
      setExito(true);
      return { ok: true };
    } catch (err) {
      const m = extraerMensajeError(err);
      setError(m);
      return { ok: false, error: m };
    } finally {
      setCargando(false);
    }
  };

  const eliminarPagina = async (id: number): Promise<boolean> => {
    setCargando(true);
    setError(null);
    setExito(false);
    try {
      await PaginaDiarioService.eliminarPagina(id);
      setExito(true);
      return true;
    } catch (err) {
      setError(extraerMensajeError(err));
      return false;
    } finally {
      setCargando(false);
    }
  };

  return {
    guardarPagina,
    actualizarPagina,
    eliminarPagina,
    cargando,
    error,
    exito,
    reset,
  };
}

