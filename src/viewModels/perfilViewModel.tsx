import { PerfilAprendiz } from "@/src/models/perfil";
import perfilAprendizServicio from "@/src/services/perfilService";
import { obtenerUserIdDesdeToken } from "@/src/utils/jwt";
import { useAuth } from "@/src/context/authContext";
import { useState } from "react";

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


  const guardarPerfil = async () => {
    if (!perfil) return;

    try {
      setGuardando(true);
      await perfilAprendizServicio.actualizarPerfil(
        perfil.codigo,
        perfil
      );
    } catch {
      setError("No se pudo guardar el perfil");
    } finally {
      setGuardando(false);
    }
  };


  const actualizarCampo = <K extends keyof PerfilAprendiz>(
    campo: K,
    valor: PerfilAprendiz[K]
  ) => {
    if (!perfil) return;

    setPerfil({
      ...perfil, [campo]: valor,
    });
  };

  return {
    perfil,
    cargando,
    guardando,
    error,
    recargarPerfil: cargarPerfil,
    guardarPerfil,
    actualizarCampo,
  };
}
