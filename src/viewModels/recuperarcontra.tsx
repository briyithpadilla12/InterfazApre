import { useState } from "react";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  return "No encontramos una cuenta con ese correo. Verifica e intenta de nuevo";
}

export function useRecuperarContraViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const reset = () => {
    setError(null);
    setExito(false);
  };

  const recuperarContra = async (correo: string): Promise<void> => {
    const correoTrim = correo?.trim();
    if (!correoTrim) {
      setError("Ingresa tu correo electrónico");
      return;
    }
    if (!EMAIL_REGEX.test(correoTrim)) {
      setError("Correo electrónico inválido");
      return;
    }

    setCargando(true);
    setError(null);
    setExito(false);

    try {
      await AutenticacionUsuServices.RecuperarContraCorreo(correoTrim);
      setExito(true);
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return {
    recuperarContra,
    cargando,
    error,
    exito,
    reset,
  };
}