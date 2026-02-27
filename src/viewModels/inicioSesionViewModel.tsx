import { useState } from "react";
import { InicioSesion } from "../models/inicioSesion";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";
import { useAuth } from "../context/authContext";

export function useInicioSesionViewModel() {

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {login} = useAuth()

  const iniciarSesion = async (credenciales: InicioSesion) => {

    setCargando(true);
    setError(null);

    try {

      const token = await AutenticacionUsuServices.InicioSesion(credenciales);

      await login(token)

      return token;

    } catch (err: any) {

      if (err.response?.status === 401) {
        setError("Credenciales incorrectas");
      } else {
        setError("Error del servidor");
      }

      throw err;

    } finally {

      setCargando(false);

    }
  };

  return {
    iniciarSesion,
    cargando,
    error
  };
}