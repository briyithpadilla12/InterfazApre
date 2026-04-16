import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/authContext";
import { obtenerUserIdDesdeToken } from "@/src/utils/jwt";
import DiarioService from "../services/diarioService";
import { Diario } from "../models/diario";

export function useDiarioViewModel() {
  const { token } = useAuth();
  const [diario, setDiario] = useState<Diario | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const asegurarDiario = useCallback(async (): Promise<Diario | null> => {
    const userId = obtenerUserIdDesdeToken(token);
    if (!userId) {
      setError("No se pudo obtener el usuario para crear el diario");
      return null;
    }

    setCargando(true);
    setError(null);

    try {
      const activos = await DiarioService.obtenerActivos();
      const userIdNum = Number(userId);
      const miDiario = activos.find((d) => d.diaAprendizFk === userIdNum);
      if (miDiario) {
        setDiario(miDiario);
        return miDiario;
      }
      const creado = await DiarioService.crearDiario({
        diaTitulo: "Mi diario emocional",
        diaAprendizFk: userIdNum,
      });
      if (creado.diaId) {
        setDiario(creado);
        return creado;
      }
      const activosTrasCrear = await DiarioService.obtenerActivos();
      const miDiarioTrasCrear = activosTrasCrear.find((d) => d.diaAprendizFk === userIdNum);
      if (miDiarioTrasCrear) {
        setDiario(miDiarioTrasCrear);
        return miDiarioTrasCrear;
      }
      setDiario(creado);
      return creado;
    } catch {
      setError("No se pudo cargar o crear tu diario. Intenta de nuevo.");
      return null;
    } finally {
      setCargando(false);
    }
  }, [token]);

  /** Actualiza título y/o imagen de portada del diario y refresca el estado local. */
  const actualizarDiario = useCallback(
    async (titulo?: string, imagenUrl?: string): Promise<boolean> => {
      if (!diario) return false;
      setCargando(true);
      setError(null);
      try {
        await DiarioService.editarDiario(diario.diaId, {
          diaTitulo: titulo ?? diario.diaTitulo,
          diaImagenUrl: imagenUrl ?? diario.diaImagenUrl,
          diaAprendizFk: diario.diaAprendizFk,
        });
        setDiario((prev) =>
          prev
            ? {
                ...prev,
                diaTitulo: titulo ?? prev.diaTitulo,
                diaImagenUrl: imagenUrl ?? prev.diaImagenUrl,
              }
            : prev
        );
        return true;
      } catch {
        setError("No se pudo actualizar el diario.");
        return false;
      } finally {
        setCargando(false);
      }
    },
    [diario]
  );

  return {
    diario,
    cargando,
    error,
    asegurarDiario,
    actualizarDiario,
  };
}
