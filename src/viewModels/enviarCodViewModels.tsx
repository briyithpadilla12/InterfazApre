import CreaciónUsuarioServices from "@/src/services/CrearUsuServices";
import { useState } from "react";
import { Codigo } from "../models/confirmarcodigo";

export function useEnviarCodViewModel() {

  const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
    const resetExito = ()=> setExito(false)

  const Confirmar = async (codigo: Codigo): Promise<void> => {
  setCargando(true);
  setError(null);
  setExito(false);



  
  try {

    const response = await CreaciónUsuarioServices.ConfirmarCod(codigo);
    setExito(true);
  } catch (err: any) {
    const mensajeBackend =
      err.response?.data || "Ocurrió un error al verificar el código";
    setError(mensajeBackend);
  } finally {
    setCargando(false);
  }
};

 const [cargandoReenvio, setCargandoReenvio] = useState(false);
  const [errorReenvio, setErrorReenvio] = useState<string | null>(null);
  const [exitoReenvio, setExitoReenvio] = useState<string | null>(null);

    const Reenviar = async (aprendizId: string): Promise<boolean> => {
    setCargandoReenvio(true);
    setErrorReenvio(null);
    setExitoReenvio(null);

    try {
      await CreaciónUsuarioServices.ReenviarCod(aprendizId);

      setExitoReenvio("Código reenviado correctamente");
      return true;
    } catch (err: any) {
      const mensaje =
        err.response?.data || "No se pudo reenviar el código";
      setErrorReenvio(mensaje);
      return false;
    } finally {
      setCargandoReenvio(false);
    }
  };

  return {
    Confirmar,
    cargando,
    error,
    exito,
    resetExito ,
     Reenviar,
    cargandoReenvio,
    errorReenvio,
    exitoReenvio
  };
}