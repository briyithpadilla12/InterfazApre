import api from "./apiCliente";
import { Diario } from "../models/diario";

interface CrearDiarioPayload {
  diaTitulo: string;
  diaAprendizFk: number;
}

/** La API devuelve diaCodigo (o id/Id en POST). Normalizamos a nuestro modelo Diario. */
function normalizarDiario(raw: Record<string, unknown>): Diario {
  const aprendiz = raw.aprendiz as Record<string, unknown> | undefined;
  const codigoAprendiz = aprendiz && typeof aprendiz.codigo !== "undefined"
    ? Number(aprendiz.codigo)
    : Number(raw.diaAprendizFk ?? raw.DiaAprendizFk ?? 0);
  return {
    diaId: Number(
      raw.diaCodigo ?? raw.DiaCodigo ?? raw.id ?? raw.Id ?? raw.diaId ?? raw.DiaId ?? 0
    ),
    diaTitulo: String(raw.diaTitulo ?? raw.DiaTitulo ?? ""),
    diaAprendizFk: codigoAprendiz,
  };
}

const DiarioService = {
  async crearDiario(payload: CrearDiarioPayload): Promise<Diario> {
    const { data } = await api.post<Record<string, unknown>>("/Diario", payload);
    const raw = data ?? {};
    console.log("[DEBUG DiarioService.crearDiario] Respuesta cruda POST /Diario:", JSON.stringify(raw));
    console.log("[DEBUG DiarioService.crearDiario] Claves del objeto:", raw ? Object.keys(raw) : []);
    const obj = raw as Record<string, unknown>;
    const inner = obj?.data ?? obj?.value ?? obj?.result;
    const toNormalize =
      inner && typeof inner === "object" && !Array.isArray(inner)
        ? (inner as Record<string, unknown>)
        : raw;
    const normalizado = normalizarDiario(toNormalize);
    console.log("[DEBUG DiarioService.crearDiario] Después de normalizar diaId:", normalizado.diaId);
    return normalizado;
  },

  /** Obtiene los diarios activos del usuario (token). Suele devolver uno por aprendiz. */
  async obtenerActivos(): Promise<Diario[]> {
    const { data } = await api.get<unknown>("/Diario/activos");
    console.log("[DEBUG DiarioService.obtenerActivos] ¿data es array?", Array.isArray(data));
    if (Array.isArray(data)) {
      console.log("[DEBUG DiarioService.obtenerActivos] Cantidad de diarios:", data.length);
      if (data.length > 0) {
        const primer = data[0] as Record<string, unknown>;
        console.log("[DEBUG DiarioService.obtenerActivos] Claves del primer ítem:", primer ? Object.keys(primer) : []);
        console.log("[DEBUG DiarioService.obtenerActivos] Primer ítem crudo:", JSON.stringify(primer));
      }
    } else {
      console.log("[DEBUG DiarioService.obtenerActivos] data no es array, tipo:", typeof data, "claves:", data && typeof data === "object" ? Object.keys(data as object) : "N/A");
    }
    if (!Array.isArray(data)) return [];
    const resultado = data.map((item) => normalizarDiario((item as Record<string, unknown>) ?? {}));
    console.log("[DEBUG DiarioService.obtenerActivos] Después de normalizar, primer diaId:", resultado[0]?.diaId);
    return resultado;
  },
};

export default DiarioService;

