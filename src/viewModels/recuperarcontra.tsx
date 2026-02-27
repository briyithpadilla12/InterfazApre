import { registro } from "@/src/models/registro";
import CreaciónUsuarioServices from "@/src/services/CrearUsuServices";
import { useState } from "react";
import AutenticacionUsuServices from "../services/AutenticacionUsuServices";

export function useRecuperarContraViewModel() {

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

const recuperarContra = async (correo: string): Promise<void> => {
  setCargando(true);
  setError(null);
  setExito(false);

  try {
    await AutenticacionUsuServices.RecuperarContraCorreo(correo);
    setExito(true);
   
  } catch (err: any) {
    setError(err.response?.data || "Ocurrió un error inesperado");
  } finally {
    setCargando(false);
  }
};

  return {
    recuperarContra,
    cargando,
    error,
    exito
  };
}