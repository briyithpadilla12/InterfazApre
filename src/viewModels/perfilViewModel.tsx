import { useEffect, useState } from "react";
import { PerfilAprendiz } from "@/src/models/perfil";
import perfilAprendizServicio from "@/src/services/perfilService";

export function usePerfilViewModel() {
  const [perfil, setPerfil] = useState<PerfilAprendiz | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<boolean>(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

 
  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const data = await perfilAprendizServicio.obtenerPerfil();
      setPerfil(data);
    } catch {
      setError("No se pudo cargar el perfil");
    } finally {
      setCargando(false);
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
