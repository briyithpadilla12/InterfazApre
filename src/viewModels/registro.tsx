import { registro } from "@/src/models/registro";
import CreaciónUsuarioServices from "@/src/services/CrearUsuServices";
import { useState } from "react";

export function useRegistroViewModel() {

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

const registrar = async (datos: registro): Promise<boolean> => {
  setCargando(true);
  setError(null);
  setExito(false);

  try {
    await CreaciónUsuarioServices.CrearPerfil(datos);
    setExito(true);
    return true; 
  } catch (err: any) {
    setError(err.response?.data || "Ocurrió un error inesperado");
    return false; 
  } finally {
    setCargando(false);
  }
};

  return {
    registrar,
    cargando,
    error,
    exito
  };
}