import api from "./apiCliente";
import { Diario } from "../models/diario";

interface CrearDiarioPayload {
  diaTitulo: string;
  diaAprendizFk: number;
}

interface EditarDiarioPayload {
  diaTitulo?: string;
  diaImagenUrl?: string;
  diaAprendizFk: number;
}

/** La API devuelve diaCodigo (o id/Id en POST). Normalizamos a nuestro modelo Diario. */
function normalizarDiario(raw: Record<string, unknown>): Diario {
  const aprendiz = raw.aprendiz as Record<string, unknown> | undefined;
  const codigoAprendiz = aprendiz && typeof aprendiz.codigo !== "undefined"
    ? Number(aprendiz.codigo)
    : Number(raw.diaAprendizFk ?? raw.DiaAprendizFk ?? 0);

  const imgRaw = raw.diaImagenUrl ?? raw.DiaImagenUrl;
  const diaImagenUrl =
    typeof imgRaw === "string" && imgRaw.trim() ? imgRaw.trim() : undefined;

  const fechaRaw = raw.diaFechaCreacion ?? raw.DiaFechaCreacion;
  const diaFechaCreacion =
    typeof fechaRaw === "string" && fechaRaw ? fechaRaw : undefined;

  return {
    diaId: Number(
      raw.diaCodigo ?? raw.DiaCodigo ?? raw.id ?? raw.Id ?? raw.diaId ?? raw.DiaId ?? 0
    ),
    diaTitulo: String(raw.diaTitulo ?? raw.DiaTitulo ?? ""),
    diaAprendizFk: codigoAprendiz,
    diaImagenUrl,
    diaFechaCreacion,
  };
}

const DiarioService = {
  async crearDiario(payload: CrearDiarioPayload): Promise<Diario> {
    const { data } = await api.post<Record<string, unknown>>("/Diario", payload);
    const raw = data ?? {};
    const obj = raw as Record<string, unknown>;
    const inner = obj?.data ?? obj?.value ?? obj?.result;
    const toNormalize =
      inner && typeof inner === "object" && !Array.isArray(inner)
        ? (inner as Record<string, unknown>)
        : raw;
    return normalizarDiario(toNormalize);
  },

  /** Obtiene los diarios activos del usuario (token). Suele devolver uno por aprendiz. */
  async obtenerActivos(): Promise<Diario[]> {
    const { data } = await api.get<unknown>("/Diario/activos");
    if (!Array.isArray(data)) return [];
    return data.map((item) => normalizarDiario((item as Record<string, unknown>) ?? {}));
  },

  /** PUT /Diario/editar/{id}: actualiza título y/o imagen de portada. */
  async editarDiario(id: number, payload: EditarDiarioPayload): Promise<void> {
    await api.put(`/Diario/editar/${id}`, payload);
  },
};

export default DiarioService;
