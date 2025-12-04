import { useState, useEffect } from "react";
import perfilService from "../services/perfilService";
import { Perfil } from "../models/perfil";

export function usePerfilViewModel() {
  const [perfil, setPerfil] = useState<Perfil | null>();
  const [cargando, setCargando] = useState(true);

  const cargarPerfil = async () => {
    setCargando(true);
    const data = await perfilService.obtenerPerfil();
    setPerfil(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return { perfil, cargando };
}
