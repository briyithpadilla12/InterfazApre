import { useState } from "react";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";

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
  return "No se pudo cambiar la contraseña. Intenta de nuevo";
}

export function useCambiarContraViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const cambiarPassword = async (
    passwordActual: string,
    passwordNueva: string
  ): Promise<boolean> => {
    if (!passwordActual?.trim()) {
      setError("Ingresa tu contraseña actual");
      return false;
    }
    if (!passwordNueva || passwordNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return false;
    }

    setCargando(true);
    setError(null);
    setExito(false);

    try {
      await AutenticacionUsuServices.CambiarPassword(passwordActual.trim(), passwordNueva);
      setExito(true);
      return true;
    } catch (err) {
      setError(extraerMensajeError(err));
      return false;
    } finally {
      setCargando(false);
    }
  };

  const reset = () => {
    setError(null);
    setExito(false);
  };

  return {
    cambiarPassword,
    cargando,
    error,
    exito,
    reset,
  };
}
