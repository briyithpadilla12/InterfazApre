import api from "./apiCliente";

export interface RecomendacionApi {
  recCodigo: number;
  recTitulo: string | null;
  recDescripcion: string | null;
  recEstado: string | null;
  recFechaVencimiento: string | null;
  recFechaCreacion: string | null;
}

export interface PsicologoResumen {
  psiCodigo: number;
  psiNombre: string;
  psiApellido: string;
}

export interface SeguimientoApi {
  segCodigo: number;
  segEstadoSeguimiento: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  segAreaRemitido: string | null;
  segTrimestreActual: string | null;
  segMotivo: string | null;
  segDescripcion: string | null;
  segFirmaProfesional: string | null;
  segFirmaAprendiz: string | null;
  psicologo: PsicologoResumen | null;
  recomendaciones: RecomendacionApi[];
}

function pick<T>(o: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (o[k] !== undefined && o[k] !== null) return o[k] as T;
  }
  return undefined;
}

/** Normaliza la respuesta de GET mi-seguimiento (camelCase / PascalCase). */
function normalizarSeguimientoPayload(raw: unknown): SeguimientoApi | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const recsRaw = pick<unknown[]>(r, "recomendaciones", "Recomendaciones");
  const recs: RecomendacionApi[] = Array.isArray(recsRaw)
    ? recsRaw.map((item) => {
        const x = item as Record<string, unknown>;
        return {
          recCodigo: Number(x.recCodigo ?? x.RecCodigo ?? 0),
          recTitulo: (x.recTitulo ?? x.RecTitulo ?? null) as string | null,
          recDescripcion: (x.recDescripcion ?? x.RecDescripcion ?? null) as string | null,
          recEstado: (x.recEstado ?? x.RecEstado ?? null) as string | null,
          recFechaVencimiento: (x.recFechaVencimiento ?? x.RecFechaVencimiento ?? null) as string | null,
          recFechaCreacion: (x.recFechaCreacion ?? x.RecFechaCreacion ?? null) as string | null,
        };
      })
    : [];

  const psiRaw = pick<Record<string, unknown>>(r, "psicologo", "Psicologo");
  const psicologo: PsicologoResumen | null = psiRaw
    ? {
        psiCodigo: Number(psiRaw.psiCodigo ?? psiRaw.PsiCodigo ?? 0),
        psiNombre: String(psiRaw.psiNombre ?? psiRaw.PsiNombre ?? ""),
        psiApellido: String(psiRaw.psiApellido ?? psiRaw.PsiApellido ?? ""),
      }
    : null;

  const trim = pick<number | string>(r, "segTrimestreActual", "SegTrimestreActual");
  const trimStr = trim != null && trim !== "" ? String(trim) : null;

  return {
    segCodigo: Number(r.segCodigo ?? r.SegCodigo ?? 0),
    segEstadoSeguimiento: (r.segEstadoSeguimiento ?? r.SegEstadoSeguimiento ?? null) as string | null,
    fechaInicio: (r.fechaInicio ?? r.FechaInicio ?? null) as string | null,
    fechaFin: (r.fechaFin ?? r.FechaFin ?? null) as string | null,
    segAreaRemitido: (r.segAreaRemitido ?? r.SegAreaRemitido ?? null) as string | null,
    segTrimestreActual: trimStr,
    segMotivo: (r.segMotivo ?? r.SegMotivo ?? null) as string | null,
    segDescripcion: (r.segDescripcion ?? r.SegDescripcion ?? null) as string | null,
    segFirmaProfesional: (r.segFirmaProfesional ?? r.SegFirmaProfesional ?? null) as string | null,
    segFirmaAprendiz: (r.segFirmaAprendiz ?? r.SegFirmaAprendiz ?? null) as string | null,
    psicologo,
    recomendaciones: recs,
  };
}

const SeguimientoService = {
  async miSeguimiento(): Promise<SeguimientoApi | null> {
    const { data } = await api.get<Record<string, unknown>>("SeguimientoAprendiz/mi-seguimiento");
    const segRaw = data?.seguimiento ?? data?.Seguimiento;
    return normalizarSeguimientoPayload(segRaw);
  },

  async firmarAprendiz(segId: number, firma: string): Promise<void> {
    await api.put(`SeguimientoAprendiz/firmar-aprendiz/${segId}`, { firma });
  },
};

export default SeguimientoService;
