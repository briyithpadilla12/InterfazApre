import api from "./apiCliente";
import type { ReporteCrearPayload } from "../models/reporte";
import { PRIORIDAD_POR_DEFECTO } from "../models/reporte";

const ES_PRIORIDAD = new Set<string>(["baja", "media", "alta", "critica"]);

/**
 * Crea un reporte (POST /api/Reporte). Requiere JWT con rol Aprendiz o Psicólogo.
 */
export async function crearReporte(payload: ReporteCrearPayload): Promise<unknown> {
  let prioridad = payload.prioridad.trim().toLowerCase();
  if (!ES_PRIORIDAD.has(prioridad)) {
    prioridad = PRIORIDAD_POR_DEFECTO;
  }
  const { data } = await api.post<unknown>("/Reporte", {
    titulo: payload.titulo.trim(),
    descripcion: payload.descripcion.trim(),
    categoria: payload.categoria.trim(),
    prioridad,
  });
  return data;
}
