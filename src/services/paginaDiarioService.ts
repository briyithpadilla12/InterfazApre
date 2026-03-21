import api from "./apiCliente";
import { PaginaDiario, PaginaDiarioResumen } from "../models/paginaDiario";

/** Item crudo que puede devolver la API (camelCase o PascalCase). */
type ItemPaginaCrudo = Record<string, unknown>;

/** Respuesta posible de paginación (ajustar si la API devuelve otro formato). */
interface PaginacionRespuesta {
  items?: ItemPaginaCrudo[];
  data?: ItemPaginaCrudo[];
}

const MAX_TITULO = 200;
const MAX_EMOCION_LEN = 50;

/** Sanitiza un string para mostrar en UI (recorta y quita caracteres de control). */
function sanitizarTexto(val: unknown, maxLen: number): string {
  const s = typeof val === "string" ? val.trim() : String(val ?? "").trim();
  const sinControl = s.replace(/[\x00-\x1F\x7F]/g, "");
  return sinControl.length > maxLen ? sinControl.slice(0, maxLen) : sinControl;
}

/** Normaliza item de la API (PascalCase o camelCase) y valida: solo devuelve si es una página válida. */
function mapearYValidarItem(item: ItemPaginaCrudo): PaginaDiarioResumen | null {
  const raw = item as Record<string, unknown>;
  const id = Number(raw.pagId ?? raw.PagId ?? 0);
  const tituloRaw = raw.pagTitulo ?? raw.PagTitulo ?? "";
  const titulo = sanitizarTexto(tituloRaw, MAX_TITULO) || "Sin título";
  const fechaRaw = raw.pagFecha ?? raw.PagFecha ?? "";
  const fecha = typeof fechaRaw === "string"
    ? (fechaRaw.includes("T") ? fechaRaw.split("T")[0] : fechaRaw)
    : "";
  const emocionesRaw = raw.emociones ?? raw.Emociones;
  const emocionNombre = raw.emocionNombre ?? raw.EmocionNombre;
  let emociones: string[] = Array.isArray(emocionesRaw)
    ? emocionesRaw.map((e) => sanitizarTexto(e, MAX_EMOCION_LEN)).filter(Boolean)
    : emocionNombre != null
      ? [sanitizarTexto(emocionNombre, MAX_EMOCION_LEN)].filter(Boolean)
      : [];

  if (!id && !titulo) return null;
  return { id: id || Math.abs(hashCode(titulo + fecha)), titulo, fecha, emociones };
}

function mapearYValidarItemDesdeDiarioEndpoint(item: ItemPaginaCrudo): PaginaDiarioResumen | null {
  const raw = item as Record<string, unknown>;

  const pagCodigoRaw = raw.pagCodigo ?? raw.PagCodigo;
  const id = typeof pagCodigoRaw === "number" ? pagCodigoRaw : Number(pagCodigoRaw ?? 0);

  const pagTituloRaw = raw.pagTitulo ?? raw.PagTitulo ?? "";
  const titulo =
    typeof pagTituloRaw === "string" ? sanitizarTexto(pagTituloRaw, MAX_TITULO) : "";

  const pagFechaRealizacionRaw = raw.pagFechaRealizacion ?? raw.PagFechaRealizacion ?? "";
  const fecha =
    typeof pagFechaRealizacionRaw === "string"
      ? pagFechaRealizacionRaw.includes("T")
        ? pagFechaRealizacionRaw.split("T")[0]
        : pagFechaRealizacionRaw
      : "";

  const emocionRaw = raw.emocion ?? raw.Emocion;
  const emocionObj = (emocionRaw && typeof emocionRaw === "object" ? emocionRaw : null) as
    | Record<string, unknown>
    | null;
  const emoNombreRaw = emocionObj?.emoNombre ?? emocionObj?.EmoNombre ?? emocionObj?.nombre;
  const emocionNombre =
    typeof emoNombreRaw === "string" ? sanitizarTexto(emoNombreRaw, MAX_EMOCION_LEN) : "";
  const emociones = emocionNombre ? [emocionNombre] : [];

  if (!id && !titulo) return null;
  return { id: id || Math.abs(hashCode(titulo + fecha)), titulo: titulo || "Sin título", fecha, emociones };
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return h;
}

const PaginaDiarioService = {
  async crearPagina(datos: PaginaDiario): Promise<void> {
    await api.post("/PaginaDiario", datos);
  },

  /**
   * GET /PaginaDiario/diario/{diarioId}
   * Devuelve páginas de un diario, normalmente en un wrapper { paginas: [...] }.
   */
  async listarPorDiario(diarioId: number): Promise<PaginaDiarioResumen[]> {
    const { data } = await api.get<unknown>(`/PaginaDiario/diario/${diarioId}`);
    const paginasRaw = Array.isArray(data)
      ? data
      : (data as { paginas?: ItemPaginaCrudo[]; Paginas?: ItemPaginaCrudo[] })?.paginas ??
        (data as { paginas?: ItemPaginaCrudo[]; Paginas?: ItemPaginaCrudo[] })?.Paginas ??
        [];

    const items = Array.isArray(paginasRaw) ? paginasRaw : [];
    return items
      .map((item) => mapearYValidarItemDesdeDiarioEndpoint(item))
      .filter((r): r is PaginaDiarioResumen => r != null);
  },

  /** Lista todas las páginas activas del usuario (según token). Solo devuelve ítems validados y sanitizados. */
  async listarActivos(): Promise<PaginaDiarioResumen[]> {
    const { data } = await api.get<unknown>("/PaginaDiario/activos");
    console.log("[DEBUG PaginaDiarioService.listarActivos] ¿data es array?", Array.isArray(data));
    if (Array.isArray(data)) {
      console.log("[DEBUG PaginaDiarioService.listarActivos] Cantidad de ítems:", data.length);
      if (data.length > 0) {
        const primer = data[0] as Record<string, unknown>;
        console.log("[DEBUG PaginaDiarioService.listarActivos] Claves del primer ítem:", primer ? Object.keys(primer) : []);
        console.log("[DEBUG PaginaDiarioService.listarActivos] ¿Tiene pagDiarioFk/PagDiarioFk/diarioId? pagDiarioFk:", (primer?.pagDiarioFk ?? primer?.PagDiarioFk ?? primer?.diarioId));
      }
    } else {
      console.log("[DEBUG PaginaDiarioService.listarActivos] data no es array, claves:", data && typeof data === "object" ? Object.keys(data as object) : "N/A");
    }
    const items = Array.isArray(data)
      ? data
      : (data as PaginacionRespuesta)?.items ?? (data as PaginacionRespuesta)?.data ?? [];
    const resultado = items
      .map((item) => mapearYValidarItem((item as ItemPaginaCrudo) ?? {}))
      .filter((r): r is PaginaDiarioResumen => r != null);
    console.log("[DEBUG PaginaDiarioService.listarActivos] Ítems después de validar:", resultado.length);
    return resultado;
  },

  /**
   * Lista páginas del diario paginadas por fecha.
   * @param diarioId ID del diario
   * @param page número de página (1-based)
   * @param fecha fecha en formato YYYY-MM-DD (ej. hoy para ver entradas recientes)
   */
  async listarPaginado(
    diarioId: number,
    page: number,
    fecha: string
  ): Promise<PaginaDiarioResumen[]> {
    const { data } = await api.get<unknown>(
      "/PaginaDiario/paginacion-por-fecha",
      { params: { diarioId, page, fecha } }
    );
    const items = Array.isArray(data)
      ? data
      : (data as PaginacionRespuesta)?.items ?? (data as PaginacionRespuesta)?.data ?? [];
    return items
      .map((item) => mapearYValidarItem((item as ItemPaginaCrudo) ?? {}))
      .filter((r): r is PaginaDiarioResumen => r != null);
  },
};

export default PaginaDiarioService;

