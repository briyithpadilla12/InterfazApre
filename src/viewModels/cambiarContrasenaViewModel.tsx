import { useState } from "react";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";
import { CambiarContrasena } from "../models/cambiarContrasena";

function extraerMensajeError(err: unknown): string {
  if (typeof err === "string") return err;
  const axiosErr = err as {
    response?: { data?: unknown; status?: number };
    message?: string;
  };
  if (axiosErr.response?.status === 400) return "La contraseña actual no es válida";
  if (axiosErr.response?.status === 401) return "Tu sesión expiró. Inicia sesión de nuevo";
  if (axiosErr.response?.status && axiosErr.response.status >= 500) {
    return "El servidor no está disponible. Intenta más tarde";
  }
  if (axiosErr.message === "Network Error" || axiosErr.message?.includes("timeout")) {
    return "Sin conexión. Revisa tu internet";
  }
  const data = axiosErr.response?.data;
  if (typeof data === "string") return data;
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }
  return "No se pudo cambiar la contraseña. Intenta de nuevo";
}

export function useCambiarContrasenaViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const limpiarMensajes = () => {
    setError(null);
    setExito(null);
  };

  const cambiarContrasena = async (
    datos: CambiarContrasena,
    confirmarPassword: string
  ): Promise<boolean> => {
    const passwordActual = datos.passwordActual?.trim();
    const passwordNueva = datos.passwordNueva?.trim();
    const confirmar = confirmarPassword?.trim();

    if (!passwordActual) {
      setError("Ingresa tu contraseña actual");
      return false;
    }
    if (!passwordNueva || passwordNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (passwordNueva !== confirmar) {
      setError("La confirmación no coincide con la nueva contraseña");
      return false;
    }
    if (passwordActual === passwordNueva) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return false;
    }

    setCargando(true);
    setError(null);
    setExito(null);
    try {
      await AutenticacionUsuServices.CambiarContrasena({
        passwordActual,
        passwordNueva,
      });
      setExito("Contraseña actualizada correctamente");
      return true;
    } catch (err) {
      setError(extraerMensajeError(err));
      return false;
    } finally {
      setCargando(false);
    }
  };

  return {
    cambiarContrasena,
    cargando,
    error,
    exito,
    limpiarMensajes,
  };
}
