import { useState } from "react";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";
import { RestablecerContra } from "../models/restablecerContra";

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
  return "No se pudo restablecer la contraseña. Verifica el código e intenta de nuevo";
}

export function useRestablecerContraViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const reset = () => {
    setError(null);
    setExito(false);
  };

  const restablecerContra = async (datos: RestablecerContra): Promise<void> => {
    const codigoTrim = datos.codigo?.trim();

    if (!datos.aprendizId || datos.aprendizId <= 0) {
      setError("Error interno. Vuelve a solicitar la recuperación de contraseña.");
      return;
    }
    if (!codigoTrim) {
      setError("Ingresa el código de 6 dígitos enviado a tu correo");
      return;
    }
    if (!datos.nuevaPassword || datos.nuevaPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);
    setError(null);
    setExito(false);

    try {
      await AutenticacionUsuServices.RestablecerContra({
        aprendizId: datos.aprendizId,
        codigo: codigoTrim,
        nuevaPassword: datos.nuevaPassword,
      });
      setExito(true);
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return {
    restablecerContra,
    cargando,
    error,
    exito,
    reset,
  };
}
