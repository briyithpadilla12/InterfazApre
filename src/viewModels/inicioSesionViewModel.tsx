import { useState } from "react";
import { InicioSesion } from "../models/inicioSesion";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";
import { useAuth } from "../context/authContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function extraerMensajeError(err: unknown): string {
  if (typeof err === "string") return err;
  const axiosErr = err as { response?: { data?: unknown; status?: number }; message?: string };
  if (axiosErr.response?.status === 401) return "Correo o contraseña incorrectos";
  if (axiosErr.response?.status === 403) return "Cuenta desactivada o no verificada";
  if (axiosErr.response?.status === 404) return "Usuario no encontrado";
  if (axiosErr.response?.status === 429) return "Demasiados intentos. Intenta más tarde";
  if (axiosErr.response?.status && axiosErr.response.status >= 500) return "El servidor no está disponible. Intenta más tarde";
  if (axiosErr.message === "Network Error" || axiosErr.message?.includes("timeout")) {
    return "Sin conexión. Revisa tu internet";
  }
  const data = axiosErr.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "message" in data && typeof (data as { message: unknown }).message === "string") {
    return (data as { message: string }).message;
  }
  return "Error al iniciar sesión. Intenta de nuevo";
}

export function useInicioSesionViewModel() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const limpiarError = () => setError(null);

  const validarCredenciales = (credenciales: InicioSesion): string | null => {
    const { correoPersonal, password } = credenciales;
    const correo = correoPersonal?.trim();
    const pass = password?.trim();
    if (!correo) return "Ingresa tu correo electrónico";
    if (!EMAIL_REGEX.test(correo)) return "Correo electrónico inválido";
    if (!pass) return "Ingresa tu contraseña";
    if (pass.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return null;
  };

  const iniciarSesion = async (credenciales: InicioSesion) => {
    const errorValidacion = validarCredenciales(credenciales);
    if (errorValidacion) {
      setError(errorValidacion);
      throw new Error(errorValidacion);
    }

    setCargando(true);
    setError(null);

    try {
      const { token, refreshToken } = await AutenticacionUsuServices.InicioSesion(credenciales);
      await login(token, refreshToken);
      return token;
    } catch (err) {
      const mensaje = extraerMensajeError(err);
      setError(mensaje);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return {
    iniciarSesion,
    cargando,
    error,
    limpiarError,
  };
}