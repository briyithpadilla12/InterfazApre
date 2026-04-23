import api from "./apiCliente";

export interface CiudadApi {
  ciuCodigo: number;
  ciuNombre: string;
  regional?: {
    regCodigo: number;
    regNombre: string;
  };
}

function normalizarCiudad(raw: Record<string, unknown>): CiudadApi {
  const regionalRaw = raw.regional as Record<string, unknown> | undefined;
  return {
    ciuCodigo: Number(raw.ciuCodigo ?? raw.CiuCodigo ?? 0),
    ciuNombre: String(raw.ciuNombre ?? raw.CiuNombre ?? "").trim(),
    regional: regionalRaw
      ? {
          regCodigo: Number(regionalRaw.regCodigo ?? regionalRaw.RegCodigo ?? 0),
          regNombre: String(regionalRaw.regNombre ?? regionalRaw.RegNombre ?? "").trim(),
        }
      : undefined,
  };
}

const ciudadService = {
  async obtenerTodas(): Promise<CiudadApi[]> {
    const { data } = await api.get<unknown>("/Ciudad");
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => normalizarCiudad((item ?? {}) as Record<string, unknown>))
      .filter((c) => c.ciuCodigo > 0 && c.ciuNombre.length > 0);
  },
};

export default ciudadService;
