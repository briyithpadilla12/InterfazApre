import api from "./apiCliente";
import {
  PaginaDiario,
  PaginaDiarioEditarPayload,
  PaginaDiarioListaItem,
  PaginaDiarioResumen,
} from "../models/paginaDiario";

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

function extraerArrayDesdeRespuesta(data: unknown): ItemPaginaCrudo[] {
  if (Array.isArray(data)) return data as ItemPaginaCrudo[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const nested =
      o.paginas ??
      o.Paginas ??
      o.data ??
      o.Data ??
      o.items ??
      o.Items ??
      o.value ??
      o.Value ??
      o.result ??
      o.Result;
    if (Array.isArray(nested)) return nested as ItemPaginaCrudo[];
  }
  return [];
}

/** Mapea un ítem de GET /PaginaDiario (o listas equivalentes) a modelo completo para lista/detalle. */
function mapearItemListaCompleta(item: ItemPaginaCrudo): PaginaDiarioListaItem | null {
  const raw = item as Record<string, unknown>;
  const id = Number(raw.pagCodigo ?? raw.PagCodigo ?? raw.pagId ?? raw.PagId ?? 0);
  const tituloRaw = raw.pagTitulo ?? raw.PagTitulo ?? "";
  const titulo =
    typeof tituloRaw === "string" ? sanitizarTexto(tituloRaw, MAX_TITULO) : "";

  const pagFechaRealizacionRaw = raw.pagFechaRealizacion ?? raw.PagFechaRealizacion ?? "";
  const pagFechaRaw = raw.pagFecha ?? raw.PagFecha ?? "";
  const fechaSrc =
    typeof pagFechaRealizacionRaw === "string" && pagFechaRealizacionRaw
      ? pagFechaRealizacionRaw
      : typeof pagFechaRaw === "string"
        ? pagFechaRaw
        : "";
  const fecha =
    typeof fechaSrc === "string"
      ? fechaSrc.includes("T")
        ? fechaSrc.split("T")[0]
        : fechaSrc
      : "";

  const emocionRaw = raw.emocion ?? raw.Emocion;
  const emocionObj = (emocionRaw && typeof emocionRaw === "object" ? emocionRaw : null) as
    | Record<string, unknown>
    | null;
  const emoNombreRaw = emocionObj?.emoNombre ?? emocionObj?.EmoNombre ?? emocionObj?.nombre;
  const emocionNombre =
    typeof emoNombreRaw === "string" ? sanitizarTexto(emoNombreRaw, MAX_EMOCION_LEN) : "";
  const emocionesRaw = raw.emociones ?? raw.Emociones;
  let emociones: string[] = Array.isArray(emocionesRaw)
    ? emocionesRaw.map((e) => sanitizarTexto(e, MAX_EMOCION_LEN)).filter(Boolean)
    : emocionNombre
      ? [emocionNombre]
      : [];

  const pagContenidoRaw = raw.pagContenido ?? raw.PagContenido ?? "";
  const pagContenido = typeof pagContenidoRaw === "string" ? pagContenidoRaw : "";

  const diarioAnidado =
    raw.diario && typeof raw.diario === "object"
      ? (raw.diario as Record<string, unknown>)
      : null;
  const pagDiarioFk = Number(
    raw.pagDiarioFk ??
      raw.PagDiarioFk ??
      raw.diarioCodigo ??
      raw.DiarioCodigo ??
      diarioAnidado?.diaCodigo ??
      diarioAnidado?.DiaCodigo ??
      diarioAnidado?.diaId ??
      diarioAnidado?.DiaId ??
      0
  );
  const pagEmocionFk = Number(raw.pagEmocionFk ?? raw.PagEmocionFk ?? 0);
  const pagImagenUrlRaw = raw.pagImagenUrl ?? raw.PagImagenUrl;
  const pagImagenUrl =
    typeof pagImagenUrlRaw === "string" && pagImagenUrlRaw.trim() ? pagImagenUrlRaw.trim() : undefined;

  if (!id && !titulo) return null;
  return {
    id: id || Math.abs(hashCode(titulo + fecha)),
    titulo: titulo || "Sin título",
    fecha,
    emociones,
    pagContenido,
    pagDiarioFk,
    pagEmocionFk,
    pagImagenUrl,
  };
}

const PaginaDiarioService = {
  async crearPagina(datos: PaginaDiario): Promise<void> {
    await api.post("/PaginaDiario", datos);
  },

  /**
   * GET /PaginaDiario — listado de páginas (contenido y FKs para ver/editar sin GET por id).
   */
  async listarDesdeRaiz(): Promise<PaginaDiarioListaItem[]> {
    const { data } = await api.get<unknown>("/PaginaDiario");
    const items = extraerArrayDesdeRespuesta(data);
    return items
      .map((item) => mapearItemListaCompleta(item))
      .filter((r): r is PaginaDiarioListaItem => r != null);
  },

  async editarPagina(id: number, payload: PaginaDiarioEditarPayload): Promise<void> {
    const body: Record<string, unknown> = {
      pagTitulo: payload.pagTitulo,
      pagContenido: payload.pagContenido,
      pagDiarioFk: payload.pagDiarioFk,
      pagEmocionFk: payload.pagEmocionFk,
    };
    if (payload.pagImagenUrl != null && payload.pagImagenUrl !== "") {
      body.pagImagenUrl = payload.pagImagenUrl;
    }
    await api.put(`/PaginaDiario/editar/${id}`, body);
  },

  async eliminarPagina(id: number): Promise<void> {
    await api.put(`/PaginaDiario/eliminar/${id}`);
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

  /**
   * Mismo origen que listarPorDiario, pero mapea a ítems completos (contenido, FKs) para cards y detalle.
   * Preferible a GET /PaginaDiario + filtro cuando el listado por diario es el contrato estable.
   */
  async listarPorDiarioCompleto(diarioId: number): Promise<PaginaDiarioListaItem[]> {
    const { data } = await api.get<unknown>(`/PaginaDiario/diario/${diarioId}`);
    const paginasRaw = Array.isArray(data)
      ? data
      : (data as { paginas?: ItemPaginaCrudo[]; Paginas?: ItemPaginaCrudo[] })?.paginas ??
        (data as { paginas?: ItemPaginaCrudo[]; Paginas?: ItemPaginaCrudo[] })?.Paginas ??
        [];

    const items = Array.isArray(paginasRaw) ? paginasRaw : [];
    return items
      .map((item) => mapearItemListaCompleta(item))
      .filter((r): r is PaginaDiarioListaItem => r != null);
  },

  /** Lista todas las páginas activas del usuario (según token). Solo devuelve ítems validados y sanitizados. */
  async listarActivos(): Promise<PaginaDiarioResumen[]> {
    const { data } = await api.get<unknown>("/PaginaDiario/activos");
    const items = Array.isArray(data)
      ? data
      : (data as PaginacionRespuesta)?.items ?? (data as PaginacionRespuesta)?.data ?? [];
    return items
      .map((item) => mapearYValidarItem((item as ItemPaginaCrudo) ?? {}))
      .filter((r): r is PaginaDiarioResumen => r != null);
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

