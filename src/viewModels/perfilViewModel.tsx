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
    console.log("[DEBUG PerfilViewModel] cargarPerfil llamado | token presente:", !!token);
    const userId = obtenerUserIdDesdeToken(token);
    console.log("[DEBUG PerfilViewModel] userId extraído del JWT:", userId);
    if (!userId) {
      console.log("[DEBUG PerfilViewModel] ERROR: userId es null/undefined");
      setError("No se pudo obtener el ID del usuario");
      setCargando(false);
      return;
    }
    try {
      setCargando(true);
      setError(null);
      console.log("[DEBUG PerfilViewModel] Llamando perfilAprendizServicio.obtenerPerfil...");
      const data = await perfilAprendizServicio.obtenerPerfil(userId);
      console.log("[DEBUG PerfilViewModel] Perfil recibido - nombreCompleto:", data?.nombreCompleto, "| correo:", data?.correoPersonal);
      setPerfil(data);
    } catch (err) {
      console.log("[DEBUG PerfilViewModel] ERROR en cargarPerfil:", err);
      setError("No se pudo cargar el perfil");
    } finally {
      setCargando(false);
      console.log("[DEBUG PerfilViewModel] cargarPerfil finalizado");
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

     console.log("payload que se envía", payload);

      await perfilAprendizServicio.actualizarPerfil(
        perfil.codigo.toString(),
        payload
      );

      console.log("Perfil actualizado correctamente");

    } catch (error) {
      console.log("Error actualizando perfil", error);
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
