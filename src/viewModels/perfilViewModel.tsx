import { PerfilAprendiz } from "@/src/models/perfil";
import perfilAprendizServicio from "@/src/services/perfilService";
import { obtenerUserIdDesdeToken } from "@/src/utils/jwt";
import { useAuth } from "@/src/context/authContext";
import { useState } from "react";
import { ActualizarPerfilAprendiz } from "../models/editardatos";

export function usePerfilViewModel() {
  const { token } = useAuth();
  const [perfil, setPerfil] = useState<PerfilAprendiz | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);

  const cargarPerfil = async () => {
    const userId = obtenerUserIdDesdeToken(token);
    if (!userId) {
      setError("No se pudo obtener el ID del usuario");
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      setError(null);
      const data = await perfilAprendizServicio.obtenerPerfil(userId);
      setPerfil(data);
    } catch (err) {
      void err;
      setError("No se pudo cargar el perfil");
    } finally {
      setCargando(false);
    }
  };
      const actualizarCampo = (campo: keyof PerfilAprendiz, valor: string) => {
    if (!perfil) return;

    setPerfil({
      ...perfil,
      [campo]: valor
    });
  };

   const construirPayload = (): ActualizarPerfilAprendiz | null => {
    if (!perfil) return null;

    const partesNombre = perfil.nombreCompleto.split(" ");

    return {
      aprNombre: partesNombre[0] ?? "",
      aprSegundoNombre: partesNombre[1] ?? "",
      aprApellido: partesNombre[2] ?? "",
      aprSegundoApellido: partesNombre[3] ?? "",

      aprTipoDocumento: perfil.tipoDocumento,
      aprNroDocumento: perfil.numeroDocumento,
      aprFechaNac: perfil.fechaNacimiento,

      aprCorreoInstitucional: perfil.correoInstitucional,
      aprCorreoPersonal: perfil.correoPersonal,

      aprDireccion: perfil.direccion,
      aprCiudadFk: 3, 

      aprTelefono: perfil.telefono,

      aprEps: perfil.eps,
      aprPatologia: perfil.patologia,
      aprTipoPoblacion: perfil.tipoPoblacion,

      aprEstadoAprFk: 1,

      aprTelefonoAcudiente: perfil.acudienteTelefono,
      aprAcudNombre: perfil.acudienteNombre,
      aprAcudApellido: perfil.acudienteApellido
    };
  };

  
  const actualizarPerfil = async () => {
    try {
      if (!perfil) return;

    

      const payload = construirPayload();

      if (!payload) return;

      await perfilAprendizServicio.actualizarPerfil(
        perfil.codigo.toString(),
        payload
      );

    } catch (error) {
      void error;
      setError("No se pudo actualizar el perfil");
    } finally {
   
    }
  };
  return {
    perfil,
    cargando,
    guardando,
    error,
    recargarPerfil: cargarPerfil,
    actualizarCampo,
    actualizarPerfil,
  };
}
