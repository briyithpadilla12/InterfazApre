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
    console.log("[DEBUG useDiarioViewModel.asegurarDiario] userId desde token:", userId, "| token presente:", !!token);
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
        console.log(
          "[DEBUG useDiarioViewModel.asegurarDiario] Usando diario del usuario logueado, diaId:",
          miDiario.diaId,
          "diaAprendizFk:",
          miDiario.diaAprendizFk
        );
        setDiario(miDiario);
        return miDiario;
      }
      console.log(
        "[DEBUG useDiarioViewModel.asegurarDiario] No hay diario del usuario",
        userIdNum,
        ", creando con diaAprendizFk:",
        userIdNum
      );
      const creado = await DiarioService.crearDiario({
        diaTitulo: "Mi diario emocional",
        diaAprendizFk: userIdNum,
      });
      if (creado.diaId) {
        console.log("[DEBUG useDiarioViewModel.asegurarDiario] Diario creado, diaId:", creado.diaId);
        setDiario(creado);
        return creado;
      }
      console.log("[DEBUG useDiarioViewModel.asegurarDiario] POST no devolvió ID, recargando activos para obtener el diario creado");
      const activosTrasCrear = await DiarioService.obtenerActivos();
      const miDiarioTrasCrear = activosTrasCrear.find((d) => d.diaAprendizFk === userIdNum);
      if (miDiarioTrasCrear) {
        setDiario(miDiarioTrasCrear);
        return miDiarioTrasCrear;
      }
      setDiario(creado);
      return creado;
    } catch (err) {
      console.log("[DEBUG useDiarioViewModel.asegurarDiario] Error:", err);
      setError("No se pudo cargar o crear tu diario. Intenta de nuevo.");
      return null;
    } finally {
      setCargando(false);
    }
  }, [token]);

  return {
    diario,
    cargando,
    error,
    asegurarDiario,
  };
}

