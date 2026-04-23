/**
 * Alineado con `ReporteCreateDTO` y reglas de `ReporteController.Crear`.
 * Prioridades válidas: baja, media, alta, critica (minúsculas, como en el API).
 */
export type PrioridadReporte = "baja" | "media" | "alta" | "critica";

export interface ReporteCrearPayload {
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: PrioridadReporte;
}

export const OPCIONES_PRIORIDAD: { value: PrioridadReporte; label: string }[] = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
];

export const PRIORIDAD_POR_DEFECTO: PrioridadReporte = "media";
