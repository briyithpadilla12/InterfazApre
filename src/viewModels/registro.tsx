import { registro } from "@/src/models/registro";
import CreaciónUsuarioServices from "@/src/services/CrearUsuServices";
import { useState } from "react";

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
  return "Ocurrió un error. Verifica los datos e intenta de nuevo";
}

export function useRegistroViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const validarDatos = (datos: registro): string | null => {
    if (!datos.aprTipoDocumento?.trim()) return "Selecciona el tipo de documento";
    if (!datos.aprNroDocumento?.trim()) return "Ingresa el número de documento";
    if (!datos.correoPersonal?.trim()) return "Ingresa tu correo electrónico";
    if (!EMAIL_REGEX.test(datos.correoPersonal.trim())) return "Correo electrónico inválido";
    if (!datos.aprPassword) return "Ingresa una contraseña";
    if (datos.aprPassword.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return null;
  };

  const registrar = async (datos: registro): Promise<boolean> => {
    const errorValidacion = validarDatos(datos);
    if (errorValidacion) {
      setError(errorValidacion);
      return false;
    }

    setCargando(true);
    setError(null);
    setExito(false);

    try {
      await CreaciónUsuarioServices.CrearPerfil(datos);
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
    registrar,
    cargando,
    error,
    exito,
  };
}